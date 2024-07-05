# STS Web Scripts

These web scripts provide custom modifications to IT Glue and Autotask. Two scripts are for Tampermoneky/Violetmonkey/Greasemonkey, the other is a Stylish stylesheet enhancement. These can be directly loaded into their respective browser extension by URL and will be updated automatically when these files get updated in git.

### IT Glue GUI Modifications
The css file includes stylesheet modifications that make it easier to navigate IT Glue. This is a WIP and more css edits will be added as time goes on. This code currently mainly targets assets and editing assets to better improve the separation between categories. It also allows you to resize textarea elements across the site and removes the Kaseya logo/link. 

**To use this, you will need a browser extension such as Stylus. You can download this here:**
* [Google Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) (also works with Edge Chromium)
* [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/styl-us/)

**To setup:**
* After the extension is installed, look for the icon in your browser:
* 
    ![Stylish Extension](https://user-images.githubusercontent.com/22362786/127243459-3cdad356-f397-491f-bbfa-6d4edb4cb734.png)
* Visit this link and simply click the install button: https://github.com/chrisjantzen/sts-web-scripts/raw/main/sts-itg-improvements.user.css
* All set! The stylesheet will auto-update going forwards. When there is an update, it will prompt you to accept the change.

I would also suggest installing 1 more pre-made user style that can be found in Stylus's library for IT Glue. It has some worthwhile enhancements that mainly improve things like spacing and sizes of content across the site. You can download it here: https://uso.kkx.one/style/152559


### IT Glue Enhancements
The js file adds some minor functionality enhancements to IT Glue. So far this script does a few things:
* Adds hotkeys for Editing an asset, Saving an asset, and creating a New asset
* Adds some extra classes to the Important Notes box (on the Site Summary asset) so that the IT Glue GUI Modifications can highlight this box and make it stand out
* Adds quick links to the Site Summary page and improves styling of this section
* Adds mass editing
* Hides the "Add embedded password" option on pages where we should be using general passwords

**To use this, you will need a browser extension such as Tampermonkey or Violetmonkey. In my experience Tampermonkey works better in Chrome, and Violetmonkey works better in Firefox. You can download these here:**
* [Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (also works with Edge Chromium)
* [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/violentmonkey/)

**To setup:**
* After the extension is installed, look for the icon in your browser.
    Tampermonkey: ![Tampermonkey](https://user-images.githubusercontent.com/22362786/127243416-a5385b6e-430a-4071-b6d6-71e4092480c3.png)   Violetmonkey: ![Violetmonkey Extension](https://user-images.githubusercontent.com/22362786/127243369-8b5f4ea9-4ebc-493b-8aef-e88e4ad2e6d1.png)
* Visit this link and simply click the install button: https://github.com/chrisjantzen/sts-web-scripts/raw/main/sts-itg-enhancements.user.js
* All set! The script will auto-update going forwards. When there is an update, it will prompt you to accept the change.

**Usage:**
* Save - Ctrl + S  (when editing most assets)
* Edit - Ctrl + E  (when viewing most assets)
* New Asset - Ctrl + B  (when viewing a single asset or a list of assets)


### Autotask Modifications - Service Call Checks
The js file adds some minor functionality enhancements to Autotask. This script will replace the Scheduled Service Call checkmarks with more informative icons.

By default, Autotask just shows a ![Checkmark](https://www.seatosky.com/wp-content/uploads/2024/07/checkmark.png) for any scheduled service calls. This will replace this checkmark with the following icons based on the state of the service call:
* ![Left Arrow in Black](https://www.seatosky.com/wp-content/uploads/2024/07/past-completed.png) - The service call was in the past and was completed.
* ![Left Arrow in Red](https://www.seatosky.com/wp-content/uploads/2024/07/past-not-completed.png) - The service call was in the past and was NOT completed.
* ![Calendar](https://www.seatosky.com/wp-content/uploads/2024/07/scheduled-today.png) - The service call is currently ongoing.
* ![Clock Ongoing](https://www.seatosky.com/wp-content/uploads/2024/07/ongoing.png) - The service call is scheduled for later today.
* ![Right Arrow in Green](https://www.seatosky.com/wp-content/uploads/2024/07/scheduled-for-future.png) - The service call is scheduled for the future, anytime after today.

If there are multiple service calls connected to a ticket, it will try to determine the most relevant one and will update the icon based on that service call. It will give preference to Service Calls in this order:
1. Any ongoing
2. The most recent in the future
3. The most recent in the past

To use this you will need a browser extension. See the IT Glue Enhancements section above.

**To setup:**
* After the extension is installed, look for the icon in your browser.
    Tampermonkey: ![Tampermonkey](https://user-images.githubusercontent.com/22362786/127243416-a5385b6e-430a-4071-b6d6-71e4092480c3.png)   Violetmonkey: ![Violetmonkey Extension](https://user-images.githubusercontent.com/22362786/127243369-8b5f4ea9-4ebc-493b-8aef-e88e4ad2e6d1.png)
* Visit this link and simply click the install button: https://github.com/chrisjantzen/sts-web-scripts/raw/main/Autotask%20Modifications%20-%20Service%20Call%20Checks.user.js
* All set! The script will auto-update going forwards. When there is an update, it will prompt you to accept the change.