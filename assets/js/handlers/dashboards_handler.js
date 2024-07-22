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
});