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

    let options_graphs = new wtools.SelectOptions();
    new wtools.Request(server_config.current.api + "/reports/graphs/read").Exec_((response_data) =>
    {
        try
        {
            let tmp_options_graphs = [];
            for(let row of response_data.body.data)
                tmp_options_graphs.push(new wtools.OptionValue(row.id, row.name));

            tmp_options_graphs.push(new wtools.OptionValue("", "Sin gr&aacute;fico", true));
            options_graphs.options = tmp_options_graphs;
            options_graphs.Build_('#component_reports_add select[name="id_graph"]');
            options_graphs.Build_('#component_reports_modify select[name="id_graph"]');
        }
        catch(error)
        {
            new wtools.Notification('WARNING', 0, '#component_reports_add .notifications').Show_('No se pudo acceder a los gr&aacute;ficos.');
            new wtools.Notification('WARNING', 0, '#component_reports_modify .notifications').Show_('No se pudo acceder a los gr&aacute;ficos.');
        }
    });

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
                    ,`<td scope="row">${options_graphs.ValueToOption_(row.rg_id)}</td>`
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
                                    <a class="dropdown-item parameters" report_id="${row.id}" report_name="${row.name}">
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
    
    // Add
    $('#component_reports_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_reports_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_reports_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_reports_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData();
        data.append("name", $('#component_reports_add input[name="name"]').val());
        data.append("state", $('#component_reports_add select[name="state"]').val());
        data.append("privacity", $('#component_reports_add select[name="privacity"]').val());
        data.append("description", $('#component_reports_add textarea[name="description"]').val());
        data.append("sql_code", $('#component_reports_add textarea[name="sql_code"]').val());
        data.append("id_graph", $('#component_reports_add select[name="id_graph"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/reports/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Reporte creado exitosamente.');
                $('#component_reports_add').modal('hide');
                report_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_reports_add .notifications').Show_('Hubo un error al crear el reporte: ' + response_data.body.message);
            }
        });
    });

    // Read Reports parameters
    $(document).on("click", '#component_reports_read table .parameters', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const report_id = $(e.target).attr('report_id');
        const report_name = $(e.target).attr('report_name');

        // Setup report parameters
        $('#component_reports_parameters input[name="id"]').val(report_id);
        $('#component_reports_parameters .modal-title strong.header').html(report_name);
        
        // Read report parameters
        new wtools.Request(server_config.current.api + `/reports/parameters/read?report_id=${report_id}`).Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                $(':input','#component_reports_modify form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo acceder a los par&aacute;metros del reporte.');
                return;
            }

            try
            {
                $('#component_reports_parameters table tbody').html('');
                for(let row of response_data.body.data)
                {
                    // Setup inputs
                    let e1 = $('<input class="form-control" name="identifier"] required>').val(row.identifier);
                    let e2 = $('<input class="form-control" name="name"] required>').val(row.name);
                    let e3_options = new wtools.SelectOptions
                    ([
                        new wtools.OptionValue("Lista de valores", "Lista de valores", true)
                        ,new wtools.OptionValue("Consulta SQL", "Consulta SQL")
                    ]);
                    let e3 = $('<select class="form-select" name="parameter_type"] required></select>');
                    e3_options.Build_(e3);
                    $(e3).val(row.parameter_type);
                    let e4 = $('<textarea class="form-control" name="values"] required></textarea>').val(row.values);

                    // Set table rows
                    let row1 = new wtools.UIElementsPackage('<tr></tr>', [$('<th></th>').append('Identificador'), $('<td></td>').append(e1)]).Pack_();
                    let row2 = new wtools.UIElementsPackage('<tr></tr>', [$('<th></th>').append('Etiqueta'), $('<td></td>').append(e2)]).Pack_();
                    let row3 = new wtools.UIElementsPackage('<tr></tr>', [$('<th></th>').append('Tipo'), $('<td></td>').append(e3)]).Pack_();
                    let row4 = new wtools.UIElementsPackage('<tr></tr>', [$('<th></th>').append('Valores'), $('<td></td>').append(e4)]).Pack_();

                    // Table and form
                    let tbody = new wtools.UIElementsPackage('<tbody></tbody>', [row1, row2, row3, row4]).Pack_();
                    let table = new wtools.UIElementsPackage('<table class="table"></table>', [tbody]).Pack_();
                    let form = new wtools.UIElementsPackage('<form class="mb-5"></form>', [
                        $('<div class="notifications"></div>')
                        ,$('<input type="hidden" name="id" required>').val(row.id)
                        ,$(`<h5>Par&aacute;metro: ${row.identifier}</h5>`)
                        ,table
                        ,$('<button type="submit" class="btn btn-primary">Guardar</button>')
                        ,$('<hr>')
                    ]).Pack_();
                    $('#component_reports_parameters .elements').append(form);
                }
            }
            catch(error)
            {
                new wtools.Notification('WARNING', 0, '#component_reports_parameters .notifications').Show_('No se pudo acceder a los par&aacute;metros del reporte: ' + error);
            }
            
            wait.Off_();
            $('#component_reports_parameters').modal('show');
        });
    });

    // Read Report to Modify
    $(document).on("click", '#component_reports_read table .modify', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const report_id = $(e.target).attr('report_id');
        const report_name = $(e.target).attr('report_name');

        // Setup report to modify
        $('#component_reports_modify input[name="id"]').val(report_id);
        $('#component_reports_modify .modal-title strong.header').html(report_name);
        
        // Read report to modify
        new wtools.Request(server_config.current.api + `/reports/read/id?id=${report_id}`).Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                $(':input','#component_reports_modify form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo acceder al reporte.');
                return;
            }
            
            $('#component_reports_modify input[name="identifier"]').val(response_data.body.data[0].identifier);
            $('#component_reports_modify input[name="name"]').val(response_data.body.data[0].name);
            $('#component_reports_modify select[name="state"]').val(response_data.body.data[0].state);
            $('#component_reports_modify select[name="privacity"]').val(response_data.body.data[0].privacity);
            $('#component_reports_modify textarea[name="description"]').val(response_data.body.data[0].description);
            $('#component_reports_modify textarea[name="sql_code"]').val(response_data.body.data[0].sql_code);
            $('#component_reports_modify select[name="id_graph"]').val(response_data.body.data[0].rg_id);

            wait.Off_();
            $('#component_reports_modify').modal('show');
        });
    });

    // Modify report
    $('#component_reports_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_reports_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_reports_modify .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_reports_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const new_data = new FormData();
        new_data.append("id", $('#component_reports_modify input[name="id"]').val());
        new_data.append("name", $('#component_reports_modify input[name="name"]').val());
        new_data.append("state", $('#component_reports_modify select[name="state"]').val());
        new_data.append("privacity", $('#component_reports_modify select[name="privacity"]').val());
        new_data.append("description", $('#component_reports_modify textarea[name="description"]').val());
        new_data.append("sql_code", $('#component_reports_modify textarea[name="sql_code"]').val());
        new_data.append("id_graph", $('#component_reports_modify select[name="id_graph"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/reports/modify", "PUT", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Reporte modificado exitosamente.');
                $('#component_reports_modify').modal('hide');
                report_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_reports_modify .notifications').Show_('Hubo un error al modificar el reporte: ' + response_data.body.message);
            }
        });
    });

});