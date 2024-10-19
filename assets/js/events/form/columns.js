$(function()
{

    // SELECT options
    const options_required = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "No", true)
        ,new wtools.OptionValue("1", "S&iacute;")
    ]);
    options_required.Build_('#component_columns_add select[name="required"]');
    options_required.Build_('#component_columns_modify select[name="required"]');

    let options_column_type = new wtools.SelectOptions();
    const options_column_type_init = (options, callback) => new wtools.Request(server_config.current.api + "/forms/columns/types/read").Exec_((response_data) =>
    {
        try
        {
            let tmp_options = [];
            for(let row of response_data.body.data)
                tmp_options.push(new wtools.OptionValue(row.id, row.name));

            options.options = tmp_options;
            options.Build_('#component_columns_add select[name="id_column_type"]');
            options.Build_('#component_columns_modify select[name="id_column_type"]');
            callback();
        }
        catch(error)
        {
            new wtools.Notification('WARNING').Show_('No se pudo acceder a los tipos de columnas.');
            new wtools.Notification('WARNING', 0, '#component_columns_add .notifications').Show_('No se pudo acceder a los tipos de columnas.');
            new wtools.Notification('WARNING', 0, '#component_columns_modify .notifications').Show_('No se pudo acceder a los tipos de columnas.');
        }
    });
    options_column_type_init(options_column_type, () => {})

    // Read columns
    const columns_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_columns_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
            return;

        // Request
        new wtools.Request(server_config.current.api + `/forms/columns/read?form-identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_columns_read .notifications').html('');
            $('#component_columns_read table tbody').html('');

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 0, '#component_columns_read .notifications').Show_('No tiene permisos para acceder a este recurso.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 0, '#component_columns_read .notifications').Show_('No se pudo acceder a las columnas.');
                return;
            }

            // Handle no results or zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_columns_read .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_columns_read .notifications').html('');
            $('#component_columns_read table tbody').html('');
            new wtools.UIElementsCreator('#component_columns_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row">${row.identifier}</th>`
                    ,`<td scope="row">${row.name}</td>`
                    ,`<td scope="row">${row.column_type_name}</td>`
                    ,`<td scope="row">${row.length}</td>`
                    ,`<td scope="row">${options_required.ValueToOption_(row.required)}</td>`
                    ,`<td scope="row">${row.default_value}</td>`
                    ,`<td scope="row">${row.description}</td>`
                    ,`<td scope="row">${row.created_at}</td>`
                ];

                return new wtools.UIElementsPackage(`<tr record-id="${row.id}"></tr>`, elements).Pack_();
            });
        });
    };
    columns_read();
    $('#component_columns_read .update').click(() => columns_read());
    
    // Setup Avanced values in Add
    $('#component_columns_add form select[name="id_column_type"]').change((e) =>
    {
        const value = $('#component_columns_add form select[name="id_column_type"]').val();
        if(value == undefined)
        {
            new wtools.Notification('WARNING', 0, '#component_columns_add .notifications').Show_('Error al configurar los valores avanzados.');
            return;
        }
        
        if(value == "2" || value == "5" || value == "6" || value == "7" || value == "8")
            $('#component_columns_add form input[name="length"]').val("");
        else if(value == "3" || value == "9")
            $('#component_columns_add form input[name="length"]').val("11");
        else if(value == "4")
            $('#component_columns_add form input[name="length"]').val("10,2");
        else if(value == "1")
            $('#component_columns_add form input[name="length"]').val("100");
        else
            $('#component_columns_add form input[name="length"]').val("");
    });

    // Click on Add Button
    $('#component_columns_read .add').click(() => 
    {
        const add = () =>
        {
            $('#component_columns_add .notifications').html('');
            $('#component_columns_add form select[name="id_column_type"]').val("1");
            $('#component_columns_add form input[name="length"]').val("100");
            $('#component_columns_add').modal('show');
        }
        options_column_type_init(options_column_type, add);
    });

    // Add
    $('#component_columns_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_columns_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_columns_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_columns_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_columns_add form')[0]);
        data.append('form-identifier', form_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/forms/columns/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 0, '#component_columns_add .notifications').Show_('No tiene permisos para acceder a este recurso.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 0, '#component_columns_add .notifications').Show_('No se pudo crear la columna: ' + response_data.body.message);
                return;
            }

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Columna creada exitosamente.');
                $('#component_columns_add').modal('hide');
                columns_read();
            }
        });
    });

    // Read column to modify
    $(document).on("click", '#component_columns_read table tbody tr', (e) =>
    {
        const read_modify = () => 
        {
            e.preventDefault();

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Get Form identifier
            const url_params = new URLSearchParams(window.location.search);
            const form_identifier = url_params.get('identifier');
            if(form_identifier == undefined)
            {
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
                return;
            }

            // Get Data ID
            let data_id = $(e.currentTarget).attr('record-id');
            if(data_id == undefined)
            {
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador de la columna.');
                return;
            }

            // Setup form to modify
            $('#component_data_modify table tbody').html('');
            
            // Read form to modify
            new wtools.Request(server_config.current.api + `/forms/columns/read/id?id=${data_id}&form-identifier=${form_identifier}`).Exec_((response_data) =>
            {
                // Permissions error
                if(response_data.status == 401)
                {
                    new wtools.Notification('WARNING').Show_('No tiene permisos para acceder a este recurso.');
                    return;
                }

                // Notification Error
                if(response_data.status != 200)
                {
                    new wtools.Notification('WARNING').Show_('No se pudo acceder a las columnas de este formulario.');
                    return;
                }

                // Handle no results or zero results
                if(response_data.body.data == undefined || response_data.body.data.length < 1)
                {
                    new wtools.Notification('SUCCESS').Show_('Sin resultados.');
                    return;
                }

                // Set data
                $('#component_columns_modify input[name="identifier"]').val(response_data.body.data[0].identifier);
                $('#component_columns_modify input[name="name"]').val(response_data.body.data[0].name);
                $('#component_columns_modify input[name="length"]').val(response_data.body.data[0].length);
                $('#component_columns_modify select[name="required"]').val(response_data.body.data[0].required);
                $('#component_columns_modify input[name="default_value"]').val(response_data.body.data[0].default_value);
                $('#component_columns_modify textarea[name="description"]').val(response_data.body.data[0].description);
                $('#component_columns_modify select[name="id_column_type"]').val(response_data.body.data[0].id_column_type);
    
                wait.Off_();
                $('#component_columns_modify form').removeClass('was-validated');
                $('#component_columns_modify').modal('show');
            });
        }
        options_column_type_init(options_column_type, read_modify);
    });
    
});