
$(function ()
{
    // Elements
        new Sidebars().SidebarMenu_();
        new Headers().Header_();
        new Footers().Footer_();
        new wtools.MenuManager('.sidebar_menu', true);
        new wtools.MenuManager('.nav_organization');
        new wtools.MenuManager('.nav_reports_add');
        

    // Verify Session
        /*new Login().VerifySession(result =>
        {
            if(!result)
            {
                new Notification('SUCCESS').Show_('Debe iniciar sesi&oacute;n para acceder.');
                window.location.href = "../login/";
            }
        });*/

});