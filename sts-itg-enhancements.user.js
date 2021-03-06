// ==UserScript==
// @name         STS IT Glue Enhancements
// @namespace    https://seatosky.itglue.com/
// @version      1.3.0
// @description  Enhancements for IT Glue - specific to Sea to Sky
// @author       Chris Jantzen
// @match        https://seatosky.itglue.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var angular = window.angular;

    // Add editing, new, and saving shortcuts
    $(window).bind('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                // Save
                case 's':
                    var successBtn = $(".btn-toolbar input.btn-success");
                    if (successBtn.length) {
                        event.preventDefault();
                        successBtn.click();
                    }
                    break;
                // Edit
                case 'e':
                    var editBtn = $(".sidebar .item-buttons a[href$='/edit']");
                    if (editBtn.length) {
                        event.preventDefault();
                        // [0] gets the native dom element, for some reason jquery can't click on this button
                        editBtn[ 0 ].click();
                    }
                    break;
                // New
                case 'b':
                    var newBtn = $("a[href$='/new']");
                    if (newBtn.length) {
                        event.preventDefault();
                        newBtn[ 0 ].click();
                    }
                    break;
            }
        }
    });

    /////////////////////////////
    // On new angular page load
    ////////////////////////////
    angular.element(function () {

        // Add classes to "Important Notes" textboxes for styling
        var importantLabel = $("div.col-sm-8 > dl > dt.render-label:contains('Important Notes')");
        var importantDD = importantLabel.next('dd');
        importantLabel.addClass('important_label');
        importantDD.addClass('important_dd');
        $(importantLabel).wrapAll( "<div class='important' />");
        var importantDiv = $(importantLabel).parent('div.important');
        $(importantDD).appendTo(importantDiv);

        // If this is a Site Summary page
        if ($("div.has-h1-header.page-header-area > div.page-header > div.sub-heading:contains('Site Summary')").length > 0) {

            // ADD Account Management and Procedures from the nav bar to the quick links section
            // Get the sections
            var sidebar = $("ul.nav.itglue-sidenav > li");
            var sidebarHeaders = sidebar.parent().find("li.sidebar-header");
            var acctmHeader = sidebarHeaders.find(":contains('Account Management')").parent('li');
            var acctmStartIndex = sidebar.index(acctmHeader);
            var acctmEndIndex = sidebar.index(acctmHeader.nextAll(".sidebar-header:first"));
            var acctmList = sidebar.slice(acctmStartIndex, acctmEndIndex).clone(true);

            var procHeader = sidebarHeaders.find(":contains('Procedures')").parent('li');
            var procStartIndex = sidebar.index(procHeader);
            var procEndIndex = sidebar.index(procHeader.nextAll(".sidebar-header:first"));
            var procList = sidebar.slice(procStartIndex, procEndIndex).clone(true);

            var devicesHeader = sidebarHeaders.find(":contains('Domain & Devices')").parent('li');
            var devicesStartIndex = sidebar.index(devicesHeader);
            var devicesList = sidebar.slice(devicesStartIndex + 4, devicesStartIndex + 6).clone(true);


            // Get the Quick Links section where they are going to
            var quickLinksHeader = $(".content-body .col-sm-8 > dl > h3.render-header.row-header:contains('Quick Links')");

            // Copy it to this location
            quickLinksHeader.after("<div class='sidebar-copy-quick-links'><ul></ul></div>");
            $(".sidebar-copy-quick-links > ul").append(acctmList).append(devicesHeader.text("Devices")).append(devicesList).append(procList);

            // SET the icons of the original Quick Links
            // Get the Quick Links section
            var mainDL = $(".content-body .col-sm-8 > dl");
            var qlHeader = mainDL.find("h3.render-header.row-header:contains('Quick Links')");
            window.faIcon = '';
            qlHeader.nextAll().each(function(i, elem) {
                // set the icon type
                if ($(elem).hasClass('render-label')) {
                    switch($(elem).text()) {
                        case "Active Directory":
                            window.faIcon = 'windows';
                            break;
                        case "Backup Solution":
                            window.faIcon = 'refresh';
                            break;
                        case "Email Service":
                            window.faIcon = 'envelope-o';
                            break;
                        case "Server Overview":
                            window.faIcon = 'terminal';
                            break;
                        default:
                            window.faIcon = '';
                    }
                }
                // change class to the new icon
                if (window.faIcon.length > 0 && $(elem).hasClass('render-upload')) {
                    $(elem).find('i.fa').removeClass('fa-table').addClass('fa-' + window.faIcon);
                }
                // new section, stop looping
                if ($(elem).hasClass('row-header')) {
                    return false;
                }
            });
        }

        // Hide embedded passwords "Add Password" option
        if (window.location.href.indexOf("/configurations/") == -1) {
            $("div#embedded_passwords #add_password").hide();
        }
    });

    /////////////////////////////
    // On React page load
    ////////////////////////////
    function reactLoad() {
        var react = window.ReactMainApp;

        reactTableLoad();

        // Add quick link to summary page for all organization links
        var organizationLinks = $('a:not(.has-summary-link):not(.menu-item-link)').filter(function() {
            return this.href.match(/\.com\/\d{7,}$/);
        });

        $.each(organizationLinks, function(i, elem) {
            var oldLink = elem.href;
            var oldTitle = '';
            if ($(elem).hasClass('org-icon')) {
                oldTitle = $(elem).find('.caption').text();
            } else {
                oldTitle = $(elem).text();
            }
            var newLink = oldLink + "/assets/174982-site-summary/records/";
            var newTitle = oldTitle + " - Summary";
            var summaryLink = $(document.createElement("a"));
            summaryLink.addClass('summary-link');
            summaryLink.attr('href', newLink);
            summaryLink.attr('title', newTitle);
            summaryLink.html("<i style='opacity: 0.5' class='fa fa-fw fa-home'></i>");
            elem.after(summaryLink[0]);
        });
        organizationLinks.addClass('has-summary-link');
    }

    function reactTableLoad() {
        // Wait for react table to load (for pages with folders)
        waitForElementToDisplay(".react-table", async function() {
            await new Promise(r => setTimeout(r, 200));
            // Make STS Only folder a star
            $('a.name-link:contains("STS Only")').closest('tr').find('i.fa.fa-folder').addClass('fa-star').removeClass('fa-folder');

            // Add the mass edit button
            waitForElementToDisplay(".buttons-container", function() {
                $(".react-table.has-bulk-actions .buttons-container").prepend('<a href="#" id="mass-edit" class="react-button autowidth pad7-12 react-new-button"><i class="fa fa-fw fa-pencil"></i>Mass Edit</a>');
                $(document).on('click', '#mass-edit', function() {
                    massEdit();
                });
            });
        },500,9000);
    }

    ////////////////////////////
    // Mutation Observer - Watch for page pathname to change
    // and then run reactLoad (this seems to be the best way to watch for pages changes in react externally)
    ////////////////////////////
    var oldPath = location.pathname;
    var observer = new MutationObserver(function(mutations) {
        if(location.pathname != oldPath){
            // On page change
            oldPath = location.pathname;
             waitForElementToDisplay("#react-main > div",function(){
                 reactLoad()
             },500,9000);
        }
    });
    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: false
    });

    ////////////////////////////
    // On initial load
    ////////////////////////////
    waitForElementToDisplay("#react-main > div",function(){
        reactLoad()
    },500,9000);


    /////////////////////////////
    // FUNCTIONS
    ////////////////////////////

    // Mass Edit
    function massEdit() {
        $(".react-table.has-bulk-actions .react-table-body tbody td.column-select-row input[type=checkbox]:checked").each(function() {
            var row = $(this).closest("tr")[0];
            var editBtn = $(row).find(".column-resource-access > div > a");
            window.open($(editBtn).attr('href'), '_blank');
        });
    }

    // Wait for element load (for watching for react div to load or other divs)
    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) != null) {
                callback();
                return;
            }
            else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                        return;
                    }
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    }

})();