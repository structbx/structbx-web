$(function()
{
    // SELECT options
    const options_states = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "Activo", true)
        ,new wtools.OptionValue("1", "Inactivo")
    ]);
    options_states.Build_('#component_dashboards_add select[name="state"]');
    options_states.Build_('#component_dashboards_modify select[name="state"]');

    const options_privacity = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "P&uacute;blico", true)
        ,new wtools.OptionValue("1", "Privado")
        ,new wtools.OptionValue("2", "S&oacute;lo yo")
    ]);
    options_privacity.Build_('#component_dashboards_add select[name="privacity"]');
    options_privacity.Build_('#component_dashboards_modify select[name="privacity"]');

    const options_added_to_start = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "No")
        ,new wtools.OptionValue("1", "S&iacute;", true)
    ]);
    options_added_to_start.Build_('#component_dashboards_add select[name="added_to_start"]');
    options_added_to_start.Build_('#component_dashboards_modify select[name="added_to_start"]');

    // Read
    const dashboard_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_dashboards_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/dashboards/read").Exec_((response_data) =>
        {
            // Error notification
            if(response_data.status != 200)
            {
                wait.Off_();
                $('#component_dashboards_read .notifications').html('');
                new wtools.Notification('WARNING', 0, '#component_dashboards_read .notifications').Show_('No se pudo acceder a los dashboards.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_dashboards_read .notifications').html('');
            $('#component_dashboards_read table tbody').html('');

            // Table
            new wtools.UIElementsCreator('#component_dashboards_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row"><a class="text-dark" href="../dashboards/?id=${row.id}">${row.name}</a></th>`
                    ,`<td scope="row">${options_states.ValueToOption_(row.state)}</td>`
                    ,`<td scope="row">${options_privacity.ValueToOption_(row.privacity)}</td>`
                    ,`<td scope="row">${options_added_to_start.ValueToOption_(row.added_to_start)}</td>`
                    ,`<td scope="row">${row.position}</td>`
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
                                    <a class="dropdown-item modify" dashboard_id="${row.id}" dashboard_name="${row.name}">
                                        Editar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item delete" dashboard_id="${row.id}" dashboard_name="${row.name}">
                                        Eliminar
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </td>`
                ];

                return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
            });

            // Contents
            $('#component_start_dashboards .contents_dashboards').html('');
            let elements = []; let cont = 0;
            for(let row of response_data.body.data)
            {
                if(cont < 4)
                {
                    elements.push(`
                        <div class="col-12 col-sm-3 p-2">
                            <a class="btn btn-secondary mb-2 p-2 d-block" href="../dashboards/?id=${row.id}">
                                <div class="mb-4"><i class="fas fa-file"></i></div>
                                <span class="ms-2">${row.name}</span>
                            </a>
                        </div>`
                    );
                }
                else
                {
                    let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                    $('#component_start_dashboards .contents_dashboards').append(ui_element);
                    cont = 0;
                    elements = [];
                }
            }
            if(elements.length > 0)
            {
                let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                $('#component_start_dashboards .contents_dashboards').append(ui_element);
            }

            // Menus
            $('.sidebar_menu .nav_dashboards').html('');
            new wtools.UIElementsCreator('.sidebar_menu .nav_dashboards', response_data.body.data).Build_((row) =>
            {
                return `
                    <div class="nav-item">
                        <a class="nav-link mb-2" href="../dashboards/?id=${row.id}">
                            <i class="fas fa-file"></i>
                            <span class="ms-2">${row.name}</span>
                        </a>
                    </div>`;
            });
        });
    };
    dashboard_read();
    $('#component_dashboards_read .update').click(() => dashboard_read());

    // Add
    $('#component_dashboards_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_dashboards_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_dashboards_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_dashboards_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData();
        data.append("name", $('#component_dashboards_add input[name="name"]').val());
        data.append("state", $('#component_dashboards_add select[name="state"]').val());
        data.append("privacity", $('#component_dashboards_add select[name="privacity"]').val());
        data.append("added_to_start", $('#component_dashboards_add select[name="added_to_start"]').val());
        data.append("position", $('#component_dashboards_add input[name="position"]').val());
        data.append("description", $('#component_dashboards_add textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/dashboards/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Dashboard creado exitosamente.');
                $('#component_dashboards_add').modal('hide');
                dashboard_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_dashboards_add .notifications').Show_('Hubo un error al crear el dashboard: ' + response_data.body.message);
            }
        });
    });

    // Read Dashboard to Modify
    $(document).on("click", '#component_dashboards_read table .modify', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const dashboard_id = $(e.target).attr('dashboard_id');
        const dashboard_name = $(e.target).attr('dashboard_name');

        // Setup dashboard to modify
        $('#component_dashboards_modify input[name="id"]').val(dashboard_id);
        $('#component_dashboards_modify .modal-title strong.header').html(dashboard_name);
        
        // Read dashboard to modify
        new wtools.Request(server_config.current.api + `/dashboards/read/id?id=${dashboard_id}`).Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                $(':input','#component_dashboards_modify form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo acceder al dashboard.');
                return;
            }
            
            $('#component_dashboards_modify input[name="identifier"]').val(response_data.body.data[0].identifier);
            $('#component_dashboards_modify input[name="name"]').val(response_data.body.data[0].name);
            $('#component_dashboards_modify select[name="state"]').val(response_data.body.data[0].state);
            $('#component_dashboards_modify select[name="privacity"]').val(response_data.body.data[0].privacity);
            $('#component_dashboards_modify select[name="added_to_start"]').val(response_data.body.data[0].added_to_start);
            $('#component_dashboards_modify select[name="position"]').val(response_data.body.data[0].position);
            $('#component_dashboards_modify textarea[name="description"]').val(response_data.body.data[0].description);

            wait.Off_();
            $('#component_dashboards_modify').modal('show');
        });
    });

    // Modify dashboard
    $('#component_dashboards_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_dashboards_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_dashboards_modify .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_dashboards_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const new_data = new FormData();
        new_data.append("id", $('#component_dashboards_modify input[name="id"]').val());
        new_data.append("identifier", $('#component_dashboards_modify input[name="identifier"]').val());
        new_data.append("name", $('#component_dashboards_modify input[name="name"]').val());
        new_data.append("state", $('#component_dashboards_modify select[name="state"]').val());
        new_data.append("privacity", $('#component_dashboards_modify select[name="privacity"]').val());
        new_data.append("added_to_start", $('#component_dashboards_modify select[name="added_to_start"]').val());
        new_data.append("position", $('#component_dashboards_modify input[name="position"]').val());
        new_data.append("description", $('#component_dashboards_modify textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/dashboards/modify", "PUT", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Dashboard modificado exitosamente.');
                $('#component_dashboards_modify').modal('hide');
                dashboard_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_dashboards_modify .notifications').Show_('Hubo un error al modificar el dashboard: ' + response_data.body.message);
            }
        });
    });

    // Read Dashboard to Delete
    $(document).on("click", '#component_dashboards_read .delete', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const dashboard_id = $(e.target).attr('dashboard_id');
        const dashboard_name = $(e.target).attr('dashboard_name');

        // Setup form to delete
        $('#component_dashboards_delete input[name=id]').val(dashboard_id);
        $('#component_dashboards_delete strong.header').html(dashboard_name);
        $('#component_dashboards_delete strong.id').html(dashboard_id);
        $('#component_dashboards_delete strong.name').html(dashboard_name);
        $('#component_dashboards_delete').modal('show');
        wait.Off_();
    });

    // Delete form
    $('#component_dashboards_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_dashboards_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const dashboard_id = $('#component_dashboards_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/dashboards/delete?id=${dashboard_id}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();

            if(response_data.status == 200)
            {
                dashboard_read();
                new wtools.Notification('SUCCESS').Show_('Dashboard eliminado exitosamente.');
                $('#component_dashboards_delete').modal('hide');
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_dashboards_delete .notifications').Show_('Hubo un error al eliminar el dashboard: ' + response_data.body.message);
            }
        });
    });
});