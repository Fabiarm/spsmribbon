<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" %>
<script type="text/javascript" src="/_controltemplates/15/SPS.MRibbon/JS/jquery.min.js"></script>
<SharePoint:ScriptLink ID="ScriptLink1" Name="SP.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
<script type="text/javascript" src="/_controltemplates/15/SPS.MRibbon/JS/Header.js"></script>
<span id="lblPerms"></span>
<span class="s4-notdlg">
    <asp:Label runat="server" ID="lblFoundPerms" Text=""></asp:Label>
    <span id="lblErrors"></span>
</span>