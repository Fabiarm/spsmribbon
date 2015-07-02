function InitRibbonDisabledItemsRemover() {
    alert('Loaded');
    var RIBBON_CONTROL_CLASS = "[class*='ms-cui-ctl']";
    var RIBBON_BUTTON_DISABLED_CLASS = "ms-cui-disabled";
    var RIBBON_BUTTON_SELECTOR = ".ms-cui-section > span > " + RIBBON_CONTROL_CLASS;
    var RIBBON_BUTTON_SELECTOR_DISABLED = RIBBON_BUTTON_SELECTOR + "." + RIBBON_BUTTON_DISABLED_CLASS;
    var RIBBON_GROUP_CLASS = "ms-cui-group";
    var RIBBON_GROUP_HIDDEN_CLASS = "ms-cui-group-hidden";

    var ribbonGroupsParserTimeout = null;

    DomHelper = {
        HasClass: function (el, className) {
            if (el.classList) { return el.classList.contains(className); }
            return (new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className));
        },
        AddClass: function (el, className) {
            if (el.classList) { el.classList.add(className); }
            else { el.className += ' ' + className; }
        }
    };

    function HideDisabledRibbonItems() {
        var ribbonGroups = document.querySelectorAll("." + RIBBON_GROUP_CLASS);
        for (var i = 0; i < ribbonGroups.length; i++) {
            var currGroup = ribbonGroups[i];
            var allGroupButtons = currGroup.querySelectorAll(RIBBON_BUTTON_SELECTOR);
            var disabledGroupButtons = currGroup.querySelectorAll(RIBBON_BUTTON_SELECTOR_DISABLED);

            // If all of the buttons in the current group are disabled
            if (allGroupButtons.length == disabledGroupButtons.length) {
                // Hide the current group completely.
                DomHelper.AddClass(currGroup, RIBBON_GROUP_HIDDEN_CLASS);
            }
        }
    }

    // Get the Ribbon Container
    var elRibbonContainer = document.getElementById('RibbonContainer');

    // Monitor the Ribbon Container's DOM Changes
    elRibbonContainer.addEventListener('DOMSubtreeModified', function (e) {
        var insertedElement = e.target;

        // If the Inserted DOM Element is a Disable Button
        if (DomHelper.HasClass(insertedElement, RIBBON_BUTTON_DISABLED_CLASS)) {
            // Hide the Disabled Ribbon Items
            if (ribbonGroupsParserTimeout != null) {
                clearTimeout(ribbonGroupsParserTimeout);
            }
            ribbonGroupsParserTimeout = setTimeout(HideDisabledRibbonItems, 50);
        }
    });
}
document.addEventListener('DOMContentLoaded', InitRibbonDisabledItemsRemover);
//_spBodyOnLoadFunctionNames.push("InitRibbonDisabledItemsRemover");