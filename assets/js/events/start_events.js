
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

    // Form requests
        // Read
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING').Show_('No se pudo acceder a los formularios.');
                return;
            }
            new wtools.UIElementsCreator('.table_forms_all tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row"><a class="text-dark" href="../form/?form=${row.identifier}">${row.identifier}</a></th>`
                    ,`<td scope="row">${row.name}</td>`
                    ,`<td scope="row">${row.state}</td>`
                    ,`<td scope="row">${row.created_at}</td>`
                    ,`<td scope="row">
                        <div class="dropdown">
                            <a
                                class="dropdown-toggle text-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <i class="fas fa-ellipsis-h"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item form_modify_button" data-bs-toggle="modal" data-bs-target="#forms_modify" form_id="${row.id}" form_name="${row.name}">
                                        Editar
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </td>`
                ];

                return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
            });
        });

        // Add
        $('.form_forms_add').submit((e) =>
        {
            e.preventDefault();
            const check = new wtools.FormChecker(e.target).Check_();
            if(!check)
            {
                $('.form_forms_add .notification').html('');
                new wtools.Notification('WARNING', 5000, '.form_add .notification').Show_('Hay campos inv&aacute;lidos.');
                return;
            }
            const data = new FormData();
            
            data.append("identifier", $('.form_forms_add input[name="form_identifier"]').val());
            data.append("name", $('.form_forms_add input[name="form_name"]').val());
            data.append("state", $('.form_forms_add select[name="form_state"]').val());
            data.append("description", $('.form_forms_add textarea[name="form_description"]').val());

            new wtools.Request(server_config.current.api + "/forms/add", "POST", data, false).Exec_((response_data) =>
            {
                if(response_data.status == 200)
                {
                    new wtools.Notification('SUCCESS').Show_('Formulario creado exitosamente.');
                    $('#forms_add button[class="btn-close"]').click();
                }
                else
                {
                    new wtools.Notification('ERROR', 0, '.form_forms_add .notification').Show_('Hubo un error al crear el formulario: ' + response_data.body.message);
                }
            });
        });

});