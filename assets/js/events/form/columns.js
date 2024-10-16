$(function()
{

    // SELECT options
    const options_required = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "No", true)
        ,new wtools.OptionValue("1", "S&iacute;")
    ]);
    //options_required.Build_('#component_columns_add select[name="required"]');
    //options_required.Build_('#component_columns_modify select[name="required"]');

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

                return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
            });
        });
    };
    columns_read();
    $('#component_columns_read .update').click(() => columns_read());
    
});