$(function()
{

    // SELECT options
    const options_states = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "Activo", true)
        ,new wtools.OptionValue("1", "Inactivo")
    ]);
    options_states.Build_('#component_reports_add select[name="state"]');
    options_states.Build_('#component_reports_modify select[name="state"]');

    const options_privacity = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "P&uacute;blico", true)
        ,new wtools.OptionValue("1", "Privado")
        ,new wtools.OptionValue("2", "S&oacute;lo yo")
    ]);
    options_privacity.Build_('#component_reports_add select[name="privacity"]');
    options_privacity.Build_('#component_reports_modify select[name="privacity"]');

    const options_graphs = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "P&uacute;blico", true)
        ,new wtools.OptionValue("1", "Privado")
        ,new wtools.OptionValue("2", "S&oacute;lo yo")
    ]);
    options_graphs.Build_('#component_reports_add select[name="rg_name"]');
    options_graphs.Build_('#component_reports_modify select[name="rg_name"]');

    // Read
    const report_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_reports_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/reports/read").Exec_((response_data) =>
        {
            // Error notification
            if(response_data.status != 200)
            {
                wait.Off_();
                $('#component_reports_read .notifications').html('');
                new wtools.Notification('WARNING', 0, '#component_reports_read .notifications').Show_('No se pudo acceder a los reportes.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_reports_read .notifications').html('');
            $('#component_reports_read table tbody').html('');
            new wtools.UIElementsCreator('#component_reports_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row"><a class="text-dark" href="../reports/?report=${row.id}">${row.name}</a></th>`
                    ,`<td scope="row">${options_states.ValueToOption_(row.state)}</td>`
                    ,`<td scope="row">${options_privacity.ValueToOption_(row.privacity)}</td>`
                    ,`<td scope="row">${row.rg_name}</td>`
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
                                    <a class="dropdown-item modify" report_id="${row.id}" report_name="${row.name}">
                                        Editar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item setup_parameters" report_id="${row.id}" report_name="${row.name}">
                                        Configurar par&aacute;metros
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item delete" report_id="${row.id}" report_name="${row.name}">
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
    report_read();
    $('#component_reports_read .update').click(() => report_read());
    
});