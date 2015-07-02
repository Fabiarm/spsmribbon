var MRibbonSets = {
    
    InitializeVariables: function () {
        MRibbonSets.s_keys = [
       "rib_p_edit",
       "rib_p_mng",
       "rib_p_share",
       "rib_p_apprl",
       "rib_p_wkf",
       "rib_p_acts",
       "rib_p_tags",
       "rib_wp_edit",
       "rib_wp_mng",
       "rib_wp_share",
       "rib_wp_lsets",
       "rib_wp_acts",
       "rib_wp_tags",
       "rib_df_new",
       "rib_df_open",
       "rib_df_mng",
       "rib_df_share",
       "rib_df_copies",
       "rib_df_wkf",
       "rib_df_tags",
       "rib_dl_view_frt",
       "rib_dl_view_mng",
       "rib_dl_tags",
       "rib_dl_share",
       "rib_dl_connect",
       "rib_dl_cust_libs",
       "rib_dl_sets",
       "rib_li_new",
       "rib_li_acts",
       "rib_li_mng",
       "rib_li_share",
       "rib_li_tags",
       "rib_li_wkf",
       "rib_ll_view_frt",
       "rib_ll_view_mng",
       "rib_ll_tags",
       "rib_ll_share",
       "rib_ll_connect",
       "rib_ll_cust_list",
       "rib_ll_sets",
       "rib_ce_new",
       "rib_ce_acts",
       "rib_ce_mng",
       "rib_ce_tags",
       "rib_ce_wkf",
       "rib_cc_scope",
       "rib_cc_exp",
       "rib_cc_view_mng",
       "rib_cc_tags",
       "rib_cc_share",
       "rib_cc_connect",
       "rib_cc_cust_list",
       "rib_cc_sets"
        ];
        MRibbonSets.b_Property = null;
        MRibbonSets.store = null;
        MRibbonSets.s_group = null;
        MRibbonSets.sel_group = null;
        MRibbonSets.allGroups = null;
        MRibbonSets.preSave_groups = '{"groups": []}';
        MRibbonSets.isRreSave = false;
    },
    ///<summary>Initialize simple data</summary>
    InitializeData: function () {
        MRibbonSets.InitializeVariables();
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', MRibbonSets.CheckPermissions());
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', MRibbonSets.ReadStore());
    },
    ///<summary>Check matrix of permissions for current user</summary>
    CheckPermissions: function () {
        $("#divTab").hide();
        var ctx = new SP.ClientContext.get_current();
        var cWeb = ctx.get_web();
        var ob = new SP.BasePermissions();
        ob.set(SP.PermissionKind.manageWeb)
        ob.set(SP.PermissionKind.managePermissions)
        var per = cWeb.doesUserHavePermissions(ob)
        ctx.executeQueryAsync(
             function () {
                 if (per.get_value() == true) {
                     $("#divTab").show();
                     MRibbonSets.InitData();
                 }
                 else {
                     $("#divTab").hide();
                     SP.UI.Status.removeAllStatus(true);
                     var status = SP.UI.Status.addStatus(Res.ss_Msg_AccessDenied_Title, Res.ss_Msg_AccessDenied);
                     SP.UI.Status.setStatusPriColor(status, 'red');
                 }
             },
             null
        );
    },
    ///<summary>Initialize UI</summary>
    InitData: function () {
        $("#spn_page_wrap").html(Res.ss_TH_Actions);
        $("#spn_PreSave_Help").html(Res.ss_PreSave_Help);
        $("#thPicker").html(Res.ss_TH_Picker);
        $("#thGroups").html(Res.ss_TH_Groups);
        $("#spn_PickerTitle").html(Res.ss_TD_Picker_Title);
        $("#divHelp").html(Res.ss_Help);
    },
    ///<summary>Read property bag 'SPS_MRibbon' for current web</summary>
    ReadStore: function () {
        MRibbonSets.IsShowChecked(false);
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();
        this.props = web.get_allProperties();
        this.groupCollection = web.get_siteGroups();
        ctx.load(web);
        ctx.load(this.props);
        ctx.load(this.groupCollection, 'Include(Title,Id)');
        ctx.executeQueryAsync(Function.createDelegate(this, MRibbonSets.GetPropertySuccess), Function.createDelegate(this, MRibbonSets.GetPropertyFail));
    },
    GetPropertySuccess: function () {
        var isExists = this.props.get_fieldValues()["SPS_MRibbon"];
        if (isExists != null) {
            MRibbonSets.b_Property = this.props.get_item('SPS_MRibbon');
        }
        MRibbonSets.allGroups = this.groupCollection;
        if (MRibbonSets.b_Property == null) {
            MRibbonSets.b_Property = '{"groups": []}';
            MRibbonSets.store = '{"groups": []}';
        }
        else {
            MRibbonSets.store = MRibbonSets.b_Property;
        }
        MRibbonSets.IsShowChecked(false);
        MRibbonSets.HideGroup();
        MRibbonSets.FillTblGroups();
    },
    GetPropertyFail: function () {
        MRibbonSets.HideGroup();
        SP.UI.Status.removeAllStatus(true);
        var status = SP.UI.Status.addStatus('', args.get_message() + '\n' + args.get_stackTrace());
        SP.UI.Status.setStatusPriColor(status, 'red');
    },
    ///<summary>Save data to property bag 'SPS_MRibbon' for current web</summary>
    SaveStore: function () {
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();
        ctx.load(web);
        this.props = web.get_allProperties();
        ctx.load(this.props);
        if (MRibbonSets.store != null) {
            this.props.set_item("SPS_MRibbon", MRibbonSets.store);
        }
        else {
            this.props.set_item("SPS_MRibbon", null);
        }
        web.update();
        ctx.executeQueryAsync(MRibbonSets.AddingSuccess, MRibbonSets.AddingFail);
    },
    AddingSuccess: function (sender, args) {
        window.frameElement.commitPopup('');
    },
    AddingFail: function (sender, args) {
        SP.UI.Status.removeAllStatus(true);
        var status = SP.UI.Status.addStatus('', args.get_message() + '\n' + args.get_stackTrace());
        SP.UI.Status.setStatusPriColor(status, 'red');
    },

    ///<summary>Event for picker: value changed</summary>
    PickerValueChanged: function (topElementId, users) {
        //Change value
    },
    ///<summary>Event for picker: control validation</summary>
    PickerControlValidate: function (topElementId, users) {
        //Validation
    },
    ///<summary>Event for picker: user resolving</summary>
    PickerUserResolved: function (topElementId, users) {
        MRibbonSets.HideGroup();
        var picker = MRibbonPP.GetPPTop(topElementId);
        var employees = picker.GetAllUserInfo();
        var userInfo = '';
        if (employees.length == 1) {
            var employee = employees[0];
            MRibbonSets.s_group = employee;
            MRibbonSets.ShowGroup(employee.Key);
        }
        else if (employees.length == 0) {
            MRibbonSets.IsShowChecked(false);
        }
    },
    ///<summary>Show UI 'Add' button for checked sharepoint group</summary>
    ShowGroup: function (groupKey) {
        $("#btnAddGroup").show();
        var jsonData = JSON.parse(MRibbonSets.b_Property);
        var jsonStore = JSON.parse(MRibbonSets.store);
        if (MRibbonSets.jsonData != null)
            for (var i = 0; i < jsonData.groups.length; i++) {
                if (jsonData.groups[i].title == groupKey) {
                    $("#btnAddGroup").hide();
                    break;
                }
            }
        if (jsonStore != null)
            for (var i = 0; i < jsonStore.groups.length; i++) {
                if (jsonStore.groups[i].title == groupKey) {
                    $("#btnAddGroup").hide();
                    break;
                }
            }
    },
    ///<summary>Hide UI 'Add' button for checked sharepoint group</summary>
    HideGroup: function () {
        $("#btnAddGroup").hide();
    },
    ///<summary>Create table with selected charepoint groups</summary>
    FillTblGroups: function () {
        var pp_id = $("[id$='pplPickerSiteRequestor']").attr("id");
        document.getElementById('tbl_selGroups').innerHTML = '';
        var text = '';
        var jsonData = JSON.parse(MRibbonSets.store);
        if (jsonData != null) {
            for (var i = 0; i < jsonData.groups.length; i++) {
                text += '<div style="border-bottom: 1px solid #ababab; padding: 3px;"><div class="th-space space1 pointer"><span id="' + jsonData.groups[i].key + '_preSave" style="display:none;"><img src="/_layouts/15/images/SPS.MRibbon/refresh.png" /></span></div>' +
                    '<div style="display: inline-block; position: relative;width:100px;vertical-align: top;"><a href="#" class="ms-heroCommandLink" onclick="MRibbonPP.AddOneInPP(\'' + jsonData.groups[i].title + '\',\'' + pp_id + '\');MRibbonSets.HideGroup();MRibbonSets.FillChecked(\'' + jsonData.groups[i].key + '\');">' +
                    jsonData.groups[i].title +
                    '</a></div>' +
                    '<div class="th-space space3 pointer">' +
                    '<img class="small-add" src="/_layouts/15/images/spcommon.png" onclick="MRibbonPP.AddOneInPP(\'' + jsonData.groups[i].title + '\',\'' + pp_id + '\');MRibbonSets.HideGroup();MRibbonSets.FillChecked(\'' + jsonData.groups[i].key + '\');" />' +
                    '</div>' +
                    '<div class="th-space space3 pointer">' +
                    '<img class="small-rmv" src="/_layouts/15/images/spcommon.png" onclick="MRibbonSets.RemoveChecked(\'' + jsonData.groups[i].key + '\');" /></div>' +
                    '</div>';
            }
        }
        if (jsonData.groups.length == 0)
            document.getElementById('tbl_selGroups').innerHTML = '<span class="th-space space1 pointer" style="overflow: hidden;">' +
                '<img class="small-wrn" src="/_layouts/15/images/spcommon.png" />' +
                '</span>&nbsp;' +
                '<span style="overflow: hidden; display: inline-block; position: relative;">' + Res.ss_TH_NoGroups + '</span>';
        else {
            document.getElementById('tbl_selGroups').innerHTML = text;
            MRibbonSets.CheckPreSave();
        }
    },
    ///<summary>Add new sharepoint group to list</summary>
    AddNewGroup: function () {
        var jsonData = JSON.parse(MRibbonSets.b_Property);
        var jsonStore = JSON.parse(MRibbonSets.store);
        var isExists = false;
        for (var i = 0; i < jsonData.groups.length; i++) {
            if (jsonData.groups[i].title == MRibbonSets.s_group.Key) {
                isExists = true;
            }
        }
        if (isExists == false) {
            var key = null;
            var groupEnumerator = MRibbonSets.allGroups.getEnumerator();
            while (groupEnumerator.moveNext()) {
                var oGroup = groupEnumerator.get_current();
                if (oGroup.get_title() == MRibbonSets.s_group.Key) {
                    key = oGroup.get_id();
                    break;
                }
            }
            if (key != null) {
                if (isExists == false) {
                    jsonStore['groups'].push({
                        "key": "" + key + "",
                        "title": "" + MRibbonSets.s_group.Key + "",
                        "rib_inact": false,
                        "rib_p_edit": false,
                        "rib_p_mng": false,
                        "rib_p_share": false,
                        "rib_p_apprl": false,
                        "rib_p_wkf": false,
                        "rib_p_acts": false,
                        "rib_p_tags": false,
                        "rib_wp_edit": false,
                        "rib_wp_mng": false,
                        "rib_wp_share": false,
                        "rib_wp_lsets": false,
                        "rib_wp_acts": false,
                        "rib_wp_tags": false,
                        "rib_df_new": false,
                        "rib_df_open": false,
                        "rib_df_mng": false,
                        "rib_df_share": false,
                        "rib_df_copies": false,
                        "rib_df_wkf": false,
                        "rib_df_tags": false,
                        "rib_dl_view_frt": false,
                        "rib_dl_view_mng": false,
                        "rib_dl_tags": false,
                        "rib_dl_share": false,
                        "rib_dl_connect": false,
                        "rib_dl_cust_libs": false,
                        "rib_dl_sets": false,
                        "rib_li_new": false,
                        "rib_li_acts": false,
                        "rib_li_mng": false,
                        "rib_li_share": false,
                        "rib_li_tags": false,
                        "rib_li_wkf": false,
                        "rib_ll_view_frt": false,
                        "rib_ll_view_mng": false,
                        "rib_ll_tags": false,
                        "rib_ll_share": false,
                        "rib_ll_connect": false,
                        "rib_ll_cust_list": false,
                        "rib_ll_sets": false,
                        "rib_ce_new": false,
                        "rib_ce_acts": false,
                        "rib_ce_mng": false,
                        "rib_ce_tags": false,
                        "rib_ce_wkf": false,
                        "rib_cc_scope": false,
                        "rib_cc_exp": false,
                        "rib_cc_view_mng": false,
                        "rib_cc_tags": false,
                        "rib_cc_share": false,
                        "rib_cc_connect": false,
                        "rib_cc_cust_list": false,
                        "rib_cc_sets": false
                    });
                    MRibbonSets.store = JSON.stringify(jsonStore);
                    MRibbonSets.AddPreSave(key);
                    MRibbonSets.HideGroup();
                    MRibbonSets.FillTblGroups();
                    MRibbonSets.CheckPreSave();
                }
            }
        }
    },
    ///<summary>Check/Uncheck categories of Ribbon for selected sharepoint group</summary>
    FillChecked: function (groupKey) {
        MRibbonSets.sel_group = groupKey;
        var jsonStore = JSON.parse(MRibbonSets.store);
        var isExists = false;
        MRibbonSets.ClearChecked();
        for (var i = 0; i < jsonStore.groups.length; i++) {
            if (jsonStore.groups[i].key == groupKey) {
                var group = jsonStore.groups[i];
                for (var index = 0; index < MRibbonSets.s_keys.length; index++) {
                    if (group[MRibbonSets.s_keys[index]] != null) {
                        var id = MRibbonSets.s_keys[index];
                        document.getElementById(id).checked = group[MRibbonSets.s_keys[index]];
                    }
                }
                var preSave_Id = "#" + groupKey + "_preSave";
                MRibbonSets.CheckPreSave();
                break;
            }
        }
        MRibbonSets.AutosizeDialog();
        MRibbonSets.IsShowChecked(true);
    },
    ///<summary>Remove selected sharepoint group from list</summary>
    RemoveChecked: function (groupKey) {
        var flag = confirm(Res.ss_Msg_Remove_Title);
        if (flag == true) {
            var jsonStore = JSON.parse(MRibbonSets.store);
            var pos = null;
            for (var i = 0; i < jsonStore.groups.length; i++) {
                if (jsonStore.groups[i].key == groupKey) {
                    pos = i;
                    break;
                }
            }
            if (pos != null) {
                jsonStore.groups.splice(pos, 1);
            }
            MRibbonSets.store = JSON.stringify(jsonStore);
            MRibbonSets.RemovePreSave(groupKey);
            MRibbonSets.FillTblGroups();
            MRibbonSets.IsShowChecked(false);
        }
    },
    ///<summary>Uncheck all categories of Ribbon</summary>
    ClearChecked: function () {
        for (var i = 0; i < MRibbonSets.s_keys.length; i++) {
            var id = "'" + MRibbonSets.s_keys[i] + "'";
            if (document.getElementById(id) != null)
                document.getElementById(id).checked = false;
        }
        MRibbonSets.IsShowChecked(false);
    },
    ///<summary>Pre save check/uncheck categories of Ribbon for selected sharepoint group</summary>
    SaveChecked: function () {
        var jsonStore = JSON.parse(MRibbonSets.store);
        if (jsonStore != null) {
            for (var i = 0; i < jsonStore.groups.length; i++) {
                if (jsonStore.groups[i].key == MRibbonSets.sel_group) {
                    for (var index = 0; index < MRibbonSets.s_keys.length; index++) {
                        var id = MRibbonSets.s_keys[index];
                        jsonStore.groups[i][MRibbonSets.s_keys[index]] = document.getElementById(id).checked;
                    }
                    var preSave_Id = "#" + jsonStore.groups[i].key + "_preSave";
                    MRibbonSets.AddPreSave(jsonStore.groups[i].key);
                    MRibbonSets.CheckPreSave();
                    break;
                }
            }
            MRibbonSets.store = JSON.stringify(jsonStore);
            SP.UI.Notify.addNotification(Res.ss_Msg_SaveTempory);
        }
    },
    ///<summary>Make autosize modal popup</summary>
    AutosizeDialog: function () {
        var dlg = SP.UI.ModalDialog.get_childDialog();
        if (dlg != null) {
            dlg.autoSize();
        }
    },
    ///<summary>Show/not show help description and tabs with categories of Ribbon</summary>
    IsShowChecked: function (flag) {
        if (flag == false) {
            $("#divRibTabs").hide();
            $("#divHelp").show();
        }
        else {
            $("#divRibTabs").show();
            $("#divHelp").hide();
        }
        MRibbonSets.AutosizeDialog();
    },
    ///<summary>Save tempory changes for all sharepoint group of the list. Save in JSON format</summary>
    AddPreSave: function (key) {
        var jsnPreSave = JSON.parse(MRibbonSets.preSave_groups);
        if (jsnPreSave != null) {
            var isExists = false;
            for (var i = 0; i < jsnPreSave.groups.length; i++)
                if (jsnPreSave.groups[i].key == key)
                    isExists = true;
            if (isExists == false) {
                MRibbonSets.isRreSave = true;
                jsnPreSave['groups'].push({ "key": "" + key + "" });
            }
            MRibbonSets.preSave_groups = JSON.stringify(jsnPreSave);
        }
    },
    ///<summary>Remove all pre-save changes</summary>
    RemovePreSave: function (key) {
        var jsnPreSave = JSON.parse(MRibbonSets.preSave_groups);
        var pos = null;
        if (jsnPreSave != null)
            for (var i = 0; i < jsnPreSave.groups.length; i++)
                if (jsnPreSave.groups[i].key == key) {
                    pos = i;
                    break;
                }
        if (pos != null) {
            MRibbonSets.isRreSave = true;
            jsnPreSave.groups.splice(pos, 1);
        }
        MRibbonSets.preSave_groups = JSON.stringify(jsnPreSave);
    },
    ///<summary>Check tempory changes for current session</summary>
    IsPreSave: function (key) {
        var jsnPreSave = JSON.parse(MRibbonSets.preSave_groups);
        if (jsnPreSave != null) {
            for (var i = 0; i < jsnPreSave.groups.length; i++) {
                if (jsnPreSave.groups[i].key == key) {
                    return true;
                }
            }
        }
        return false;
    },
    ///<summary>Check tempory data changes for sharepoint groups in the list</summary>
    CheckPreSave: function () {
        var jsnPreSave = JSON.parse(MRibbonSets.preSave_groups);
        if (jsnPreSave != null) {
            for (var i = 0; i < jsnPreSave.groups.length; i++) {
                var preSave_Id = "#" + jsnPreSave.groups[i].key + "_preSave";
                $(preSave_Id).show();
            }
        }
    },
    ///<summary>Close modal popup</summary>
    Close: function () {
        if (MRibbonSets.isRreSave == true) {
            var flag = confirm(Res.ss_Msg_Close_Title);
            if (flag == true) {
                MRibbonSets.SaveChecked();
                MRibbonSets.SaveStore();
            }
        }
        window.frameElement.cancelPopUp();
    }
}
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', MRibbonSets.InitializeData);