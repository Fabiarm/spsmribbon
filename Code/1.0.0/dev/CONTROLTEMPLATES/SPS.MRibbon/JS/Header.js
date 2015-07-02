var MRibbonHead = {
    InitializeVariables: function () {
        MRibbonHead.s_tempPerms = '{ "rib_inact": false, "rib_p_edit": false, "rib_p_mng": false, "rib_p_share": false, "rib_p_apprl": false, "rib_p_wkf": false, "rib_p_acts": false, "rib_p_tags": false, "rib_wp_edit": false, "rib_wp_mng": false, "rib_wp_share": false, "rib_wp_lsets": false, "rib_wp_acts": false, "rib_wp_tags": false, "rib_df_new":false, "rib_df_open":false, "rib_df_mng":false, "rib_df_share":false, "rib_df_copies":false, "rib_df_wkf":false, "rib_df_tags":false, "rib_dl_view_frt":false, "rib_dl_view_mng":false, "rib_dl_tags":false, "rib_dl_share":false, "rib_dl_connect":false, "rib_dl_cust_libs":false, "rib_dl_sets":false, "rib_li_new":false, "rib_li_acts":false, "rib_li_mng":false, "rib_li_share":false, "rib_li_tags":false, "rib_li_wkf":false, "rib_ll_view_frt":false, "rib_ll_view_mng":false, "rib_ll_tags":false, "rib_ll_share":false, "rib_ll_connect":false, "rib_ll_cust_list":false, "rib_ll_sets":false, "rib_ce_new":false, "rib_ce_acts":false, "rib_ce_mng":false, "rib_ce_tags":false, "rib_ce_wkf":false, "rib_cc_scope":false, "rib_cc_exp":false, "rib_cc_view_mng":false, "rib_cc_tags":false, "rib_cc_share":false, "rib_cc_connect":false, "rib_cc_cust_list":false, "rib_cc_sets":false }';
        MRibbonHead.keys = [
            "rib_inact",
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
        MRibbonHead.s_activeGroups = null;
        MRibbonHead.s_foundGroups = null;
        MRibbonHead.s_allGroups = null;
        MRibbonHead.s_groupKeys = null;
        MRibbonHead.s_perms = null;
        MRibbonHead.bProperty = null;
        MRibbonHead.allGroups = null;
    },
    InitializeData: function () {
        MRibbonHead.InitializeVariables();
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', MRibbonHead.ReadSettings());
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', MRibbonHead.InitializeGroups());
    },
    WriteMessage: function (text) {
        SP.UI.Notify.addNotification(text, false);
    },
    ///<summary>Getting property 'SPS_MRibbon' of the current web</summary>
    ReadSettings: function () {
        var ctx = new SP.ClientContext.get_current();
        var cWeb = ctx.get_web();
        this.props = cWeb.get_allProperties();
        ctx.load(cWeb);
        ctx.load(this.props);
        ctx.executeQueryAsync(Function.createDelegate(this, MRibbonHead.GetPropSuccess), Function.createDelegate(this, MRibbonHead.GetPropFail));
    },
    GetPropSuccess: function () {
        var isExists = this.props.get_fieldValues()["SPS_MRibbon"];
        if (isExists != null)
            MRibbonHead.bProperty = this.props.get_item('SPS_MRibbon');
        else
            MRibbonHead.bProperty = '{"groups": []}';
        MRibbonHead.s_groupKeys = '';
        var jsonData = JSON.parse(MRibbonHead.bProperty);
        if (jsonData != null) {
            for (var i = 0; i < jsonData.groups.length; i++) {
                var counter = jsonData.groups[i];
                MRibbonHead.s_groupKeys = MRibbonHead.s_groupKeys + counter.key + ",";
            }
            MRibbonHead.s_groupKeys = MRibbonHead.s_groupKeys.slice(0, MRibbonHead.s_groupKeys.length - 1);
        }
    },
    GetPropFail: function () {
        $("#lblErrors").html('<div class="ms-status-red" style="padding:5px;"><span class="ms-status-red">' + args.get_message() + args.get_stackTrace() + '</span></div>');
    },
    ///<summary>Allow to get group where current user has permissions of current web</summary>
    InitializeGroups: function () {
        var ctx = new SP.ClientContext.get_current();
        var cWeb = ctx.get_web();
        //this.groupCollection = cWeb.get_siteGroups();
        //ctx.load(this.groupCollection, 'Include(Title,Id,Users.Include(Title,LoginName,Id))');
        MRibbonHead.allGroups = cWeb.get_siteGroups();
        ctx.load(MRibbonHead.allGroups, 'Include(Title,Id,Users.Include(Title,LoginName,Id))');
        ctx.executeQueryAsync(Function.createDelegate(this, MRibbonHead.InitGroupsSuccess), Function.createDelegate(this, MRibbonHead.InitGroupsFail));
    },
    InitGroupsSuccess: function (sender, args) {
        //allGroups = groupCollection;
        MRibbonHead.s_activeGroups = '{"groups": [';
        MRibbonHead.s_allGroups = '{"groups": [';
        var groupEnumerator = MRibbonHead.allGroups.getEnumerator();
        while (groupEnumerator.moveNext()) {
            var oGroup = groupEnumerator.get_current();
            MRibbonHead.s_allGroups += '{ "key": "' + oGroup.get_id() + '" },';
            var collUser = oGroup.get_users();
            var userEnumerator = collUser.getEnumerator();
            while (userEnumerator.moveNext()) {
                var oUser = userEnumerator.get_current();
                if (oUser.get_id() == _spPageContextInfo.userId) {
                    MRibbonHead.s_activeGroups += '{ "key": "' + oGroup.get_id() + '" },';
                }
            }
        }
        MRibbonHead.s_activeGroups = MRibbonHead.s_activeGroups.slice(0, MRibbonHead.s_activeGroups.length - 1) + ']}';
        MRibbonHead.s_allGroups = MRibbonHead.s_allGroups.slice(0, MRibbonHead.s_allGroups.length - 1) + ']}';
        MRibbonHead.FindGroups();
        MRibbonHead.ComparePermissions();
    },
    InitGroupsFail: function (sender, args) {
        $("#lblErrors").html('<div class="ms-status-red" style="padding:5px;"><span class="ms-status-red">' + args.get_message() + args.get_stackTrace() + '</span></div>');
    },
    ///<summary>Allow to find groups for current user</summary>
    FindGroups: function () {
        MRibbonHead.s_foundGroups = '{"groups": [';
        var activeGroups = JSON.parse(MRibbonHead.s_activeGroups);
        var allGroups = JSON.parse(MRibbonHead.s_allGroups);
        var groupKeys = JSON.parse(MRibbonHead.bProperty);
        if (groupKeys != null) {
            for (var i = 0; i < groupKeys.groups.length; i++) {
                for (var j = 0; j < activeGroups.groups.length; j++) {
                    if (groupKeys.groups[i].key == activeGroups.groups[j].key) {
                        MRibbonHead.s_foundGroups += '{ "key": "' + activeGroups.groups[j].key + '" },';
                    }
                }
            }
            MRibbonHead.s_foundGroups = MRibbonHead.s_foundGroups.slice(0, MRibbonHead.s_foundGroups.length - 1) + ']}';
        }
    },
    ///<summary>Create matrix of permissions</summary>
    ComparePermissions: function () {
        var groupKeys = JSON.parse(MRibbonHead.bProperty);
        var foundGroups = JSON.parse(MRibbonHead.s_foundGroups);
        var tempPerms = JSON.parse(MRibbonHead.s_tempPerms);
        for (var i = 0; i < foundGroups.groups.length; i++) {
            for (var j = 0; j < groupKeys.groups.length; j++) {
                if (foundGroups.groups[i].key == groupKeys.groups[j].key) {
                    var index;
                    for (index = 0; index < MRibbonHead.keys.length; index++) {
                        if (groupKeys.groups[j][MRibbonHead.keys[index]] != null)
                            if (groupKeys.groups[j][MRibbonHead.keys[index]] == true)
                                tempPerms[MRibbonHead.keys[index]] = true;
                    }
                }
            }
        }
        MRibbonHead.s_perms = '<style>';
        document.getElementById('lblPerms').innerHTML = '';
        if (tempPerms.rib_p_edit == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.Edit"],';
        if (tempPerms.rib_p_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.Manage"],';
        if (tempPerms.rib_p_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.Share"],';
        if (tempPerms.rib_p_apprl == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.Approval"],';
        if (tempPerms.rib_p_wkf == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.Workflow"],';
        if (tempPerms.rib_p_acts == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.Actions"],';
        if (tempPerms.rib_p_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WebPartPage.TagsAndNotes"],';
        //wiki
        if (tempPerms.rib_wp_edit == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WikiPageTab.EditAndCheckout"],';
        if (tempPerms.rib_wp_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WikiPageTab.Manage"],';
        if (tempPerms.rib_wp_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WikiPageTab.Share"],';
        if (tempPerms.rib_wp_acts == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WikiPageTab.PageActions"],';
        if (tempPerms.rib_wp_lsets == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WikiPageTab.LibrarySettings"],';
        if (tempPerms.rib_wp_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.WikiPageTab.TagsAndNotes"],';
        //documents
        if (tempPerms.rib_df_new == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.New"], a[id^="idHomePageNewDocument"],';
        if (tempPerms.rib_df_open == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.EditCheckout"],';
        if (tempPerms.rib_df_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.Manage"],';
        if (tempPerms.rib_df_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.Share"],';
        if (tempPerms.rib_df_copies == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.Copies"],';
        if (tempPerms.rib_df_wkf == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.Workflow"],';
        if (tempPerms.rib_df_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Documents.TagsAndNotes"],';
        if (tempPerms.rib_dl_view_frt == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.ViewFormat"],';
        if (tempPerms.rib_dl_view_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.CustomViews"],';
        if (tempPerms.rib_dl_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.TagsAndNotes"],';
        if (tempPerms.rib_dl_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.Share"],';
        if (tempPerms.rib_dl_connect == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.Actions"],';
        if (tempPerms.rib_dl_cust_libs == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.CustomizeLibrary"],';
        if (tempPerms.rib_dl_sets == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Library.Settings"],';
        //list
        if (tempPerms.rib_li_new == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.ListItem.New"], a[id$="idHomePageNewItem"], a[id$="idHomePageNewLink"], a[id^="NewPostLink"],';
        if (tempPerms.rib_li_acts == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.ListItem.Actions"],';
        if (tempPerms.rib_li_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.ListItem.Manage"],';
        if (tempPerms.rib_li_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.ListItem.Share"],';
        if (tempPerms.rib_li_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.ListItem.TagsAndNotes"],';
        if (tempPerms.rib_li_wkf == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.ListItem.Workflow"],';
        if (tempPerms.rib_ll_view_frt == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.ViewFormat"],';
        if (tempPerms.rib_ll_view_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.CustomViews"],';
        if (tempPerms.rib_ll_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.TagsAndNotes"],';
        if (tempPerms.rib_ll_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.Share"],';
        if (tempPerms.rib_ll_connect == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.Actions"],';
        if (tempPerms.rib_ll_cust_list == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.CustomizeList"],';
        if (tempPerms.rib_ll_sets == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.List.Settings"],';
        //calendar
        if (tempPerms.rib_ce_new == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Events.New"],';
        if (tempPerms.rib_ce_acts == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Events.Actions"],';
        if (tempPerms.rib_ce_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Events.Manage"],';
        if (tempPerms.rib_ce_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Events.TagsAndNotes"],';
        if (tempPerms.rib_ce_wkf == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Events.Workflow"],';
        if (tempPerms.rib_cc_scope == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.Scope"],';
        if (tempPerms.rib_cc_exp == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.Expander"],';
        if (tempPerms.rib_cc_view_mng == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.CustomViews"],';
        if (tempPerms.rib_cc_tags == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.TagsAndNotes"],';
        if (tempPerms.rib_cc_share == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.Share"],';
        if (tempPerms.rib_cc_connect == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.Actions"],';
        if (tempPerms.rib_cc_cust_list == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.CustomizeList"],';
        if (tempPerms.rib_cc_sets == true)
            MRibbonHead.s_perms += '#RibbonContainer li[id$="Ribbon.Calendar.Calendar.Settings"],';

        MRibbonHead.s_perms = MRibbonHead.s_perms.slice(0, MRibbonHead.s_perms.length - 1);
        MRibbonHead.s_perms += '{ display: none !important; }</style>';
        document.getElementById('lblPerms').innerHTML = MRibbonHead.s_perms;
    }
}
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', MRibbonHead.InitializeData);