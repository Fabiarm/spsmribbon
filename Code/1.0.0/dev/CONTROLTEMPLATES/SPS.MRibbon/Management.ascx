<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" %>
<SharePoint:ScriptLink ID="ScriptLink1" Name="SP.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
<script type="text/javascript" src="/_layouts/15/ScriptResx.ashx?culture=<SharePoint:EncodedLiteral runat='server' text='<%$Resources:wss,language_value%>' EncodeMethod='HtmlEncode' />&name=SPS.MRibbon"></script>
<script type="text/ecmascript" src="/_layouts/15/SP.UI.Dialog.js"></script>
<script type="text/ecmascript">

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', Initialize);

    function Initialize() {
        var ctx = new SP.ClientContext.get_current();
        var cWeb = ctx.get_web();
        var ob = new SP.BasePermissions();
        ob.set(SP.PermissionKind.manageWeb)
        ob.set(SP.PermissionKind.managePermissions)
        var per = cWeb.doesUserHavePermissions(ob)
        ctx.executeQueryAsync(
             function () {
                 if (per.get_value() == true) {
                     var control = '<a title="' + Res.pa_Alt + '" class="ms-promotedActionButton" style="display: inline-block;" href="#" onclick="javascript:ShowSettings();return false;">' +
                         '<span class="s4-clust ms-promotedActionButton-icon" style="width: 16px; height: 16px; overflow: hidden; display: inline-block; position: relative;">' +
                         '<img style="position: absolute; left: -178px; top: -113px;" src="/_layouts/15/images/spcommon.png" />' +
                         '</span>' +
                         '<span class="ms-promotedActionButton-text">' + Res.pa_Text + '</span>' +
                         '</a>';
                     document.getElementById('lblPromoted').innerHTML = control;
                 }
             },
             null
        );
    }
    function ShowSettings() {
        var options = {
            url: SP.Utilities.Utility.getLayoutsPageUrl('SPS.MRibbon/Settings.aspx'),
            allowMaximize: false,
            autoSize: true,
            showClose: false,
            dialogReturnValueCallback: function (dialogResult) {
                SP.UI.ModalDialog.RefreshPage(dialogResult)
            }
        };
        SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
    }
</script>
<span id="lblPromoted"></span>