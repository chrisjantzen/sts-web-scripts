// ==UserScript==
// @name         Autotask Modifications - Service Call Checks
// @namespace    http://tampermonkey.net/
// @version      2024-07-05
// @description  This replaces the scheduled service call checkmarks in Autotask with icons showing whether they are currently happening, scheduled for the future, or if they happened in the past. Also shows if a past one was missed or completed.
// @author       Chris Jantzen - Sea to Sky
// @match        *.autotask.net/*
// @match        */Mvc/ServiceDesk/MyWorkspaceAndQueuesTickets.mvc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotask.net
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    const $j = window.jQuery.noConflict();
    const dateRegex = /((\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) ([A|P]M)) - ((\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) ([A|P]M))/g;
    const ajaxIdentifierRegex = /var t="MvcAjaxIdentifier=([A-Z0-9]{15,45})";/;
    var todayDate = null;
    var tomorrowDate = null;
    var allowedPages = ["MyTaskAndTicket", "Summary"];

    // Function to observe changes in the target div's ID attribute (as this is how Autotask updates the iFrame)
    function observeDivChangesByClass(targetDivClasses) {
        $j(document).ready(function() {
            const targetDivs = $j(`.${targetDivClasses.join('.')}`);

            targetDivs.each(function() {
                const observer = new MutationObserver(() => {
                    var path = window.location.pathname;
                    var page = path.split("/").pop();
                    console.log("Observer", "On page: ", page);

                    // Only modify the selected pages
                    if (allowedPages.includes(page)) {
                        updateServiceCallChecks();
                    }
                });

                observer.observe(this, { childList: true, attributes: false, subtree: false });
            });
        });
    }

    // Function to compare dates for sorting service calls
    function compareDates(a, b) {
        return new Date(b.startDate) - new Date(a.startDate);
    }

    // Watch for page load and div changes
    window.addEventListener('load', function() {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        console.log("Load", "On page: ", page);

        // Only modify the selected pages
        if (allowedPages.includes(page)) {
           updateServiceCallChecks();
        }
    }, false);

    observeDivChangesByClass(['PrimaryContentContainer1', 'Active']);

    function updateServiceCallChecks() {
        todayDate = new Date();
        tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        tomorrowDate.setHours(0,0,0,0);

        // Find all the checkmarks (these may not be in the service call column)
        var checks = $j("table").find("td div.StandardButtonIcon.Check");


        // Get the MvcAjaxIdentifier for making ajax calls
        var mvcAjaxIdentifier = false;
        if (unsafeWindow.Autotask.AjaxRequestData.prototype.__serialize) {
            var ajaxIdentifierFunction = unsafeWindow.Autotask.AjaxRequestData.prototype.__serialize.toString();
            var ajaxIdentifierMatches = ajaxIdentifierFunction.match(ajaxIdentifierRegex);
            mvcAjaxIdentifier = ajaxIdentifierMatches[1];
            console.log("Got the mvcAjaxIdentifier: ", mvcAjaxIdentifier);
        }

        if (mvcAjaxIdentifier) {
            checks.each(function() {
                var check = this;

                // Check the header and skip if not the service call column
                var checkTdIndex = $j(this).parent().index();
                var headerRow = $j(this).closest('table').closest('div.Body').parent('div').find('div.Header').find('tr.Heading:first');
                var headerText = headerRow.find("td").eq(checkTdIndex).text();

                if (headerText != "Service Call Scheduled") {
                    return;
                }

                // Get the ticket ID
                var row = $j(this).closest('tr');
                var ticketId = row.data('row-key');

                // Do an ajax call to get the service call information
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://ww5.autotask.net/Mvc/ServiceDesk/TicketServiceCallToDoTab.mvc/ServiceCallToDo?ticketId=${ticketId}&isTicketEditEnabled=False&MvcAjaxIdentifier=${mvcAjaxIdentifier}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        "referer": "https://ww5.autotask.net/Mvc/ServiceDesk/MyWorkspace.mvc/MyTaskAndTicket",
                        "origin":   "https://ww5.autotask.net/Mvc/ServiceDesk/MyWorkspace.mvc/MyTaskAndTicket"

                    },
                    onload: function(response) {
                        var responseJson = $j.parseJSON(response.responseText);
                        var serviceCalls = [];

                        if (responseJson && responseJson.htmlJavaScriptPair.Html.HtmlForInstanceTrackerContainer) {
                            var responseHtml = $j.parseHTML(responseJson.htmlJavaScriptPair.Html.HtmlForInstanceTrackerContainer);
                            var table = $j(responseJson.htmlJavaScriptPair.Html.HtmlForInstanceTrackerContainer).find("table").eq(1);

                            if (table) {
                                // Parse all of the service calls
                                var rows = table.find('tr');
                                rows.each(function() {

                                    var startDateHtml = $j(this).find("td.DateTimeCell").eq(0);
                                    var startDateHtml_Date = startDateHtml.find("div").eq(0).text();
                                    var startDateHtml_Time = startDateHtml.find("div").eq(1).text();
                                    var startDate = new Date(Date.parse(`${startDateHtml_Date} ${startDateHtml_Time}`,'MM/dd/yyyy h:m a'));

                                    var endDateHtml = $j(this).find("td.DateTimeCell").eq(1);
                                    var endDateHtml_Date = endDateHtml.find("div").eq(0).text();
                                    var endDateHtml_Time = endDateHtml.find("div").eq(1).text();
                                    var endDate = new Date(Date.parse(`${endDateHtml_Date} ${endDateHtml_Time}`,'MM/dd/yyyy h:m a'));

                                    var complete = $j(this).find("td.TextCell.SA.FW100.AL").text() == "Complete" ? true : false;

                                    serviceCalls.push({
                                        "startDate": startDate,
                                        "endDate": endDate,
                                        "complete": complete
                                    });
                                });
                            }
                        }

                        // Filter serviceCalls to the one we want to target (1st - any ongoing, 2nd - the most recent in the future, 3rd - the most recent in the past)
                        serviceCalls.sort(compareDates); // Sort the serviceCalls array based on startDate
                        let serviceCall;

                        if (todayDate >= new Date(serviceCalls[0].startDate) && todayDate <= new Date(serviceCalls[0].endDate)) {
                            // Today's date is within the first call's startDate and endDate
                            serviceCall = serviceCalls[0];
                        } else if (serviceCalls.length > 0) {
                            let lastFutureCallIndex = -1;
                            let lastPastCallIndex = -1;

                            // Find the index of the last future call
                            for (let i = 0; i < serviceCalls.length; i++) {
                                const call = serviceCalls[i];
                                if (new Date(call.endDate) > todayDate) {
                                    lastFutureCallIndex = i;
                                } else {
                                    break; // No need to check further if we found a past call
                                }
                            }

                            // Find the index of the last past call
                            for (let i = serviceCalls.length - 1; i >= 0; i--) {
                                const call = serviceCalls[i];
                                if (new Date(call.startDate) <= todayDate) {
                                    lastPastCallIndex = i;
                                } else {
                                    break; // No need to check further if we found a future call
                                }
                            }

                            if (lastFutureCallIndex !== -1) {
                                // There is a future call, select the most recent one
                                serviceCall = serviceCalls[lastFutureCallIndex];
                            } else if (lastPastCallIndex !== -1) {
                                // All calls are in the past, select the most recent one
                                serviceCall = serviceCalls[lastPastCallIndex];
                            }
                        }

                        // Update icons for each scheduled service call
                        console.log("Service call:", serviceCall);
                        if (todayDate > serviceCall.startDate && todayDate <= serviceCall.endDate) {
                            // Ongoing
                            console.log("Ongoing");
                            $j(check).css("background-position", "-294px -63px");
                            $j(check).css("-webkit-transform", "scaleX(-1)");
                            $j(check).css("transform", "scaleX(-1)");
                        } else if (serviceCall.startDate > todayDate && serviceCall.startDate < tomorrowDate) {
                            // Happening later today
                            console.log("Happening later today");
                            $j(check).css("background-position", "-84px -189px");
                        } else if (serviceCall.startDate > tomorrowDate) {
                            // Happening in the future
                            console.log("Happening in the future");
                            $j(check).css("background-position", "-42px -105px");
                            $j(check).css("filter", "brightness(0) saturate(100%) invert(61%) sepia(65%) saturate(437%) hue-rotate(46deg) brightness(96%) contrast(92%)");
                        } else if (serviceCall.endDate < todayDate && serviceCall.complete) {
                            // Happened in the past and completed
                            console.log("Happened in the past and completed");
                            $j(check).css("background-position", "-21px -105px");
                        } else if (serviceCall.endDate < todayDate && !serviceCall.complete) {
                            // Happened in the past and NOT completed
                            console.log("Happened in the past and NOT completed");
                            $j(check).css("background-position", "-21px -105px");
                            $j(check).css("filter", "brightness(0) saturate(100%) invert(32%) sepia(80%) saturate(4601%) hue-rotate(345deg) brightness(84%) contrast(96%)");
                        } else {
                            // This should never happen, if it does, don't change the icon
                            console.warning("The service call date didn't fall into past, today, or future. No changes were made.");
                        }
                    }
                });
            });
        } else {
            console.error("Could not get the mvcAjaxIdentifier. Did not make any changes.");
        }
    }
})();