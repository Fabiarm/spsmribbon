<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" Inherits="Microsoft.SharePoint.WebControls.LayoutsPageBase" DynamicMasterPageFile="~masterurl/default.master" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link rel="stylesheet" type="text/css" href="/_controltemplates/15/SPS.MRibbon/CSS/Settings.css" />
    <script type="text/javascript" src="/_controltemplates/15/SPS.MRibbon/JS/jquery.min.js"></script>
    <SharePoint:ScriptLink ID="splink" Name="SP.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <script type="text/javascript" src="/_layouts/15/ScriptResx.ashx?culture=<SharePoint:EncodedLiteral runat='server' text='<%$Resources:wss,language_value%>' EncodeMethod='HtmlEncode' />&name=SPS.MRibbon"></script>
    <script type="text/ecmascript" src="/_layouts/15/SP.UI.Dialog.js"></script>
    <script type="text/javascript" src="/_controltemplates/15/SPS.MRibbon/JS/ClientPP.js"></script>
    <script type="text/javascript" src="/_controltemplates/15/SPS.MRibbon/JS/Settings.js"></script>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <SharePoint:FormDigest ID="digest" runat="server"></SharePoint:FormDigest>
    <div id="divTab" style="display: none !important; min-height: 500px;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 590px;">
            <tr>
                <th colspan="2" class="t-left"><span id="thPicker"></span></th>
                <th class="t-left">
                    <div class="th-space space1"></div>
                    <span id="thGroups"></span></th>
            </tr>
            <tr>
                <td class="v-top" style="width: 400px;">
                    <SharePoint:ClientPeoplePicker
                        Required="true"
                        PrincipalSource="All"
                        ValidationEnabled="true"
                        ID="pplPickerSiteRequestor"
                        UseLocalSuggestionCache="false"
                        OnControlValidateClientScript="MRibbonSets.PickerControlValidate"
                        OnUserResolvedClientScript="MRibbonSets.PickerUserResolved"
                        OnValueChangedClientScript="MRibbonSets.PickerValueChanged"
                        PrincipalAccountType="SPGroup"
                        runat="server"
                        VisibleSuggestions="5"
                        Rows="1"
                        AllowMultipleEntities="false"
                        CssClass="ms-long ms-spellcheck-true user-block" />
                </td>
                <td class="v-top">
                    <span class="th-space space2">
                        <img id="btnAddGroup" alt="" class="add" src="/_layouts/15/images/spcommon.png" onclick="MRibbonSets.AddNewGroup();" />
                    </span>
                </td>
                <td rowspan="2" class="v-top">
                    <div id="tbl_selGroups"></div>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="v-top">
                    <div id="divHelp" style="width: 400px; height: 450px;"></div>
                    <div id="divRibTabs" class="v-top v-height450">
                        <span id="spn_PickerTitle" style="padding: 0px; margin: 0px;"></span>
                        <div id="spn_page_wrap"></div>
                        <table id="tblTabs" class="tabs-style">
                            <tr>
                                <td colspan="2" class="tabs-head">
                                    <span id="spn_PreSave_Help" class="tabs-help">
                                    </span>
                                    <span class="s-space btn_scale">
                                        <img alt="" class="pre-save" src="/_layouts/15/images/SPS.MRibbon/formatmap32x32.png" onclick="MRibbonSets.SaveChecked();" />
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="3" class="v-top">
                    <span class="s-space">
                        <img alt="" class="close" src="/_layouts/15/images/SPS.MRibbon/formatmap32x32.png" onclick="MRibbonSets.Close();" />
                    </span>&nbsp;
                    <span  class="s-space">
                        <img alt="" class="save" src="/_layouts/15/images/SPS.MRibbon/formatmap32x32.png" onclick="MRibbonSets.SaveStore();" />
                    </span>
                </td>
            </tr>
        </table>
    </div>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>
