
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
                                <li>
                                    <a class="dropdown-item form_delete_button" data-bs-toggle="modal" data-bs-target="#forms_delete" form_id="${row.id}" form_name="${row.name}">
                                        Eliminar
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

        // Modify
        $(document).on("click", '.form_modify_button', (e) =>
        {
            e.preventDefault();

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Form data
            const form_id = $(e.target).attr('form_id');
            const form_name = $(e.target).attr('form_name');

            // Setup form to modify
            $('.form_forms_modify strong.form_name').html(form_name);
            
            // Read form to modify
            const data = [{"action_id": "a1", "parameters":[{"name": "form_id", "value": form_id}]}]
            new wtools.Request(server_config.current.api + "/forms/read/id", "GET", data, true).Exec_((response_data) =>
            {
                if(response_data.status != 200)
                {
                    wait.Off_();
                    new wtools.Notification('WARNING').Show_('No se pudo acceder al formulario.');
                    $('.form_forms_modify button[class="btn-close"]').click();
                    $(':input','.form_forms_modify')
                        .not(':button, :submit, :reset, :hidden')
                        .val('')
                        .prop('checked', false)
                        .prop('selected', false);
                    return;
                }
                
                $('.form_forms_modify input[name="form_modify_identifier"]').val(response_data.body.data[0].identifier);
                $('.form_forms_modify input[name="form_modify_name"]').val(response_data.body.data[0].name);
                $('.form_forms_modify select[name="form_modify_state"]').val(response_data.body.data[0].state);
                $('.form_forms_modify textarea[name="form_modify_description"]').val(response_data.body.data[0].description);

                wait.Off_();
            });

            // Modify form
            $('.form_forms_modify').submit((e) =>
            {
                e.preventDefault();

                const check = new wtools.FormChecker(e.target).Check_();
                if(!check)
                {
                    $('.forms_modify .notification').html('');
                    new wtools.Notification('WARNING', 5000, '.forms_modify .notification').Show_('Hay campos inv&aacute;lidos.');
                    return;
                }
                const new_data = new FormData();
                
                new_data.append("id", form_id);
                new_data.append("identifier", $('.form_forms_modify input[name="form_modify_identifier"]').val());
                new_data.append("name", $('.form_forms_modify input[name="form_modify_name"]').val());
                new_data.append("state", $('.form_forms_modify select[name="form_modify_state"]').val());
                new_data.append("description", $('.form_forms_modify textarea[name="form_modify_description"]').val());
    
                new wtools.Request(server_config.current.api + "/forms/modify", "PUT", new_data, false).Exec_((response_data) =>
                {
                    if(response_data.status == 200)
                    {
                        new wtools.Notification('SUCCESS').Show_('Formulario modificado exitosamente.');
                        $('#forms_modify button[class="btn-close"]').click();
                    }
                    else
                    {
                        new wtools.Notification('ERROR', 0, '.form_forms_modify .notification').Show_('Hubo un error al modificar el formulario: ' + response_data.body.message);
                    }
                });
            });
        });
    
        // Delete
        $(document).on("click", '.form_delete_button', (e) =>
        {
            e.preventDefault();

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Form data
            const form_id = $(e.target).attr('form_id');
            const form_name = $(e.target).attr('form_name');

            // Setup form to delete
            $('.form_forms_delete strong.form_id').html(form_id);
            $('.form_forms_delete strong.form_name').html(form_name);
            wait.Off_();

            // Delete form
            $('.form_forms_delete').submit((e) =>
            {
                e.preventDefault();

                new wtools.Request(server_config.current.api + `/forms/delete?id=${form_id}`, "DEL").Exec_((response_data) =>
                {
                    if(response_data.status == 200)
                    {
                        new wtools.Notification('SUCCESS').Show_('Formulario eliminado exitosamente.');
                        $('#forms_delete button[class="btn-close"]').click();
                    }
                    else
                    {
                        new wtools.Notification('ERROR', 0, '.form_forms_delete .notification').Show_('Hubo un error al eliminar el formulario: ' + response_data.body.message);
                    }
                });
            });
        });
});