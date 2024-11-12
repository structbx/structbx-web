$(function()
{
    // SELECT options
    const options_status = new wtools.SelectOptions
    ([
        new wtools.OptionValue("activo", "Activo", true)
        ,new wtools.OptionValue("inactivo", "Inactivo")
    ]);
    options_status.Build_('#component_users_read select[name="required"]');
    options_status.Build_('#component_users_read select[name="required"]');

    // Read Spaces Users
    const spaces_users_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_users_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const space_identifier = url_params.get('identifier');
        if(space_identifier == undefined)
        {
            new wtools.Notification('WARNING', '#component_users_read .notifications').Show_('No se encontr&oacute; el identificador del espacio.');
            window.location.href = "/start/"
            return;
        }

        // Request
        new wtools.Request(server_config.current.api + `/spaces/users/read?space_id=${space_identifier}`).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_users_read .notifications', 'Espacios: Modificar');
            if(!result.Verify_())
                return;
            
            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING', '#component_users_read .notifications').Show_('No se pudo acceder a la informaci&oacute;n general del espacio.');
                return;
            }

            // Results elements creator
            $('#component_users_read .notifications').html('');
            $('#component_users_read table tbody').html('');
            new wtools.UIElementsCreator('#component_users_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    ,`<td scope="row">${row.username}</td>`
                    ,`<td scope="row">${options_status.ValueToOption_(row.status)}</td>`
                    ,`<td scope="row">${row.group}</td>`
                    ,`<td scope="row">${row.created_at}</td>`
                ];

                return new wtools.UIElementsPackage(`<tr column-id="${row.id}"></tr>`, elements).Pack_();
            });
        });
    };
    spaces_users_read();
    $('#component_users_read .update').click(() => spaces_users_read());
    
});