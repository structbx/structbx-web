$(function()
{

    // Read
    const dashboard_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_dashboards_read .notifications', true, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/dashboards/read").Exec_((response_data) =>
        {
            // Error notification
            if(response_data.status != 200)
            {
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo acceder a los dashboards.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_dashboards_read table tbody').html('');
            new wtools.UIElementsCreator('#component_dashboards_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row"><a class="text-dark" href="../dashboards/?id=${row.id}">${row.name}</a></th>`
                    ,`<td scope="row">${row.state}</td>`
                    ,`<td scope="row">${row.privacity}</td>`
                    ,`<td scope="row">${row.position}</td>`
                    ,`<td scope="row">${row.added_to_start == 1 ? "S&iacute;" : "No"}</td>`
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

});