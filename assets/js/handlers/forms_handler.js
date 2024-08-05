$(function()
{

    // SELECT options
    const options_states = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "Activo", true)
        ,new wtools.OptionValue("1", "Inactivo")
    ]);
    options_states.Build_('#component_forms_add select[name="state"]');
    options_states.Build_('#component_forms_modify select[name="state"]');

    // Read
    const form_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_forms_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            // Error notification
            if(response_data.status != 200)
            {
                wait.Off_();
                $('#component_forms_read .notifications').html('');
                new wtools.Notification('WARNING', 0, '#component_forms_read .notifications').Show_('No se pudo acceder a los formularios.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_forms_read .notifications').html('');
            $('#component_forms_read table tbody').html('');
            new wtools.UIElementsCreator('#component_forms_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row"><a class="text-dark" href="../form/?form=${row.identifier}">${row.identifier}</a></th>`
                    ,`<td scope="row">${row.name}</td>`
                    ,`<td scope="row">${options_states.ValueToOption_(row.state)}</td>`
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
                                    <a class="dropdown-item modify" form_id="${row.id}" form_name="${row.name}">
                                        Editar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item delete" form_id="${row.id}" form_name="${row.name}">
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
    };
    form_read();
    $('#component_forms_read .update').click(() => form_read());
    
    // Add
    $('#component_forms_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_forms_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_forms_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData();
        data.append("identifier", $('#component_forms_add input[name="identifier"]').val());
        data.append("name", $('#component_forms_add input[name="name"]').val());
        data.append("state", $('#component_forms_add select[name="state"]').val());
        data.append("description", $('#component_forms_add textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/forms/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Formulario creado exitosamente.');
                $('#component_forms_add').modal('hide');
                form_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_forms_add .notifications').Show_('Hubo un error al crear el formulario: ' + response_data.body.message);
            }
        });
    });

    // Read Form to Modify
    $(document).on("click", '#component_forms_read table .modify', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const form_id = $(e.target).attr('form_id');
        const form_name = $(e.target).attr('form_name');

        // Setup form to modify
        $('#component_forms_modify input[name="id"]').val(form_id);
        $('#component_forms_modify .modal-title strong.header').html(form_name);
        
        // Read form to modify
        new wtools.Request(server_config.current.api + `/forms/read/id?id=${form_id}`).Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                $(':input','#component_forms_modify form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo acceder al formulario.');
                return;
            }
            
            $('#component_forms_modify input[name="identifier"]').val(response_data.body.data[0].identifier);
            $('#component_forms_modify input[name="name"]').val(response_data.body.data[0].name);
            $('#component_forms_modify select[name="state"]').val(response_data.body.data[0].state);
            $('#component_forms_modify textarea[name="description"]').val(response_data.body.data[0].description);

            wait.Off_();
            $('#component_forms_modify').modal('show');
        });
    });

    // Modify form
    $('#component_forms_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_forms_modify .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_forms_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const new_data = new FormData();
        new_data.append("id", $('#component_forms_modify input[name="id"]').val());
        new_data.append("identifier", $('#component_forms_modify input[name="identifier"]').val());
        new_data.append("name", $('#component_forms_modify input[name="name"]').val());
        new_data.append("state", $('#component_forms_modify select[name="state"]').val());
        new_data.append("description", $('#component_forms_modify textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/forms/modify", "PUT", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Formulario modificado exitosamente.');
                $('#component_forms_modify').modal('hide');
                form_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_forms_modify .notifications').Show_('Hubo un error al modificar el formulario: ' + response_data.body.message);
            }
        });
    });

    // Read form to Delete
    $(document).on("click", '#component_forms_read .delete', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const form_id = $(e.target).attr('form_id');
        const form_name = $(e.target).attr('form_name');

        // Setup form to delete
        $('#component_forms_delete input[name=id]').val(form_id);
        $('#component_forms_delete strong.header').html(form_name);
        $('#component_forms_delete strong.id').html(form_id);
        $('#component_forms_delete strong.name').html(form_name);
        $('#component_forms_delete').modal('show');
        wait.Off_();
    });

    // Delete form
    $('#component_forms_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const form_id = $('#component_forms_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/forms/delete?id=${form_id}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();

            if(response_data.status == 200)
            {
                form_read();
                new wtools.Notification('SUCCESS').Show_('Formulario eliminado exitosamente.');
                $('#component_forms_delete').modal('hide');
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_forms_delete .notifications').Show_('Hubo un error al eliminar el formulario: ' + response_data.body.message);
            }
        });
    });
});