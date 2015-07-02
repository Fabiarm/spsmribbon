var MRibbonPP = {

    ///<summary>Get people picker entity for current state</summary>
    ///<param name="clientId" type="string">People picker control Id</param>
    GetPP: function(clientId) {
        var key = clientId + "_TopSpan";
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[key];
        return picker;
    },

    ///<summary>Get people picker entity by topElementId</summary>
    ///<param name="topElementId" type="string">People picker control Id</param>
    GetPPTop: function (topElementId) {
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[topElementId];
        return picker;
    },

    ///<summary>Remove all user/goup entity from people picker</summary>
    ///<param name="clientId" type="string">People picker control Id</param>
    RemoveAllInPP: function(clientId) {
        var spPeoplePicker = MRibbonPP.GetPP(clientId);
        if (spPeoplePicker) {
            var ResolvedUsersList = $(document.getElementById(spPeoplePicker.ResolvedListElementId)).find("span[class='sp-peoplepicker-userSpan']");
            $(ResolvedUsersList).each(function (index) {
                spPeoplePicker.DeleteProcessedUser(this);
            });
        }
    },

    ///<summary>Add group name to people picker control</summary>
    ///<param name="groupKey" type="string">Group key</param>
    ///<param name="clientId" type="string">People picker control Id</param>
    AddInPP: function (groupKey, clientId) {
        var picker = MRibbonPP.GetPP(clientId);
        picker.AddUserKeys(groupKey);
    },

    ///<summary>Add the group name to people picker control</summary>
    ///<param name="groupKey" type="string">Group key</param>
    ///<param name="clientId" type="string">People picker control Id</param>
    AddOneInPP: function (groupKey, clientId) {
        var picker = MRibbonPP.GetPP(clientId);
        MRibbonPP.RemoveAllInPP(clientId);
        picker.AddUserKeys(groupKey);
    }
}