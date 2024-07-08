
$(function ()
{
    // Web Elements
        let webE = new WebElements();
        webE.SidebarMenu_();
        webE.Header_();
        webE.Footer_();
        new MenuManager('.sidebar_menu', true);
        new MenuManager('.nav_organization');
        new MenuManager('.nav_reports_add');

    // Verify Session
        /*new Login().VerifySession(result =>
        {
            if(!result)
            {
                new Notification('SUCCESS').Show_('Debe iniciar sesi&oacute;n para acceder.');
                window.location.href = "../login/";
            }
        });*/

    // Get Form Request
        new Request(new ServerConfig().api_url + "/forms").Exec_((response_data) =>
        {
            if(response_data.error == true)
            {
                new Notification('WARNING').Show_('No se pudo acceder a los formularios.');
                return;
            }

            new RowTable(response_data.body.data).Build_('.table_forms_all', (row) =>
            {
                return [
                    `<th scope="row"><a href="../form/?form=${row.identifier}">${row.name}</a></th>`
                    ,`<td scope="row">${row.state}</td>`
                    ,`<td scope="row">${row.created_at}</td>`
                ];
            });
        });
});