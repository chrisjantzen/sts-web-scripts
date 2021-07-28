# STS Web Scripts

These web scripts provide custom modifications to IT Glue. One script is for Tampermoneky/Violetmonkey/Greasemonkey, the other is a Stylish stylesheet enhancement. These can be directly loaded into their respective browser extension by URL and will be updated automatically when these files get updated in git.

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