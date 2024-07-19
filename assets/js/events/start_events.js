
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

    // Form requests
        // Read
        new Request(new ServerConfig().api_url + "/forms/read").Exec_((response_data) =>
        {
            if(response_data.status != 200)
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
                    ,`<td scope="row">
                        <div class="dropdown">
                            <button
                                class="btn btn-dark-static dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                            <i class="fas fa-ellipsis-h"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#forms_modify" id_form="${row.id}">
                                        Editar
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </td>`
                ];
            });
        });

        // Add
        $('.form_forms_add').submit((e) =>
        {
            e.preventDefault();
            const check = new FormChecker(e.target).Check_();
            if(!check)
            {
                $('.form_forms_add .notification').html('');
                new Notification('WARNING', 5000, '.form_add .notification').Show_('Hay campos inv&aacute;lidos.');
                return;
            }
            const data = new FormData();
            
            data.append("identifier", $('.form_forms_add input[name="form_identifier"]').val());
            data.append("name", $('.form_forms_add input[name="form_name"]').val());
            data.append("state", $('.form_forms_add select[name="form_state"]').val());
            data.append("description", $('.form_forms_add textarea[name="form_description"]').val());

            new Request(new ServerConfig().api_url + "/forms/add", "POST", data, false).Exec_((response_data) =>
            {
                if(response_data.status == 200)
                {
                    new Notification('SUCCESS').Show_('Formulario creado exitosamente.');
                    $('#forms_add button[class="btn-close"]').click();
                }
                else
                {
                    new Notification('ERROR', 0, '.form_forms_add .notification').Show_('Hubo un error al crear el formulario: ' + response_data.body.message);
                }
            });
        });
});