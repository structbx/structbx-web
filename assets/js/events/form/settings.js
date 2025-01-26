$(function()
{
    // SELECT options
    const options_permissions = new wtools.SelectOptions
    ([
        new wtools.OptionValue("0", "No", true)
        ,new wtools.OptionValue("1", "S&iacute;")
    ]);
    options_permissions.Build_('#component_settings_permissions_add select[name="read"]');
    options_permissions.Build_('#component_settings_permissions_modify select[name="read"]');
    options_permissions.Build_('#component_settings_permissions_add select[name="add"]');
    options_permissions.Build_('#component_settings_permissions_modify select[name="add"]');
    options_permissions.Build_('#component_settings_permissions_add select[name="modify"]');
    options_permissions.Build_('#component_settings_permissions_modify select[name="modify"]');
    options_permissions.Build_('#component_settings_permissions_add select[name="delete"]');
    options_permissions.Build_('#component_settings_permissions_modify select[name="delete"]');

    // Read
    const settings_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_settings_general .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');
        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }
        
        // Request
        new wtools.Request(server_config.current.api + `/forms/read/identifier?identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_settings_general .notifications').html('');
            wtools.CleanForm($('#component_settings_general form'));

            // Manage response
            const result = new ResponseManager(response_data, '#component_settings_general .notifications', 'Configuraciones: General');
            if(!result.Verify_())
                return;

            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 5000, '#component_settings_general .notifications').Show_('Sin resultados.');
                return;
            }
            
            $('#component_settings_general input[name="id"]').val(response_data.body.data[0].id);
            $('#component_settings_general input[name="identifier"]').val(response_data.body.data[0].identifier);
            $('#component_settings_general input[name="name"]').val(response_data.body.data[0].name);
            $('#component_settings_general textarea[name="description"]').val(response_data.body.data[0].description);
        });
    };
    settings_read();

    // Read form permissions
    const settings_read_permissions = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_settings_permissions .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');
        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }
        
        // Request
        new wtools.Request(server_config.current.api + `/forms/permissions/read?form-identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_settings_permissions .notifications').html('');
            wtools.CleanForm($('#component_settings_permissions table tbody'));

            // Manage response
            const result = new ResponseManager(response_data, '#component_settings_permissions .notifications', 'Configuraciones: Permisos');
            if(!result.Verify_())
                return;

            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 5000, '#component_settings_permissions .notifications').Show_('Sin resultados.');
                return;
            }
            
            new wtools.UIElementsCreator('#component_settings_permissions table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row">${row.username}</th>`
                    ,`<td scope="row">${options_permissions.ValueToOption_(row.read)}</td>`
                    ,`<td scope="row">${options_permissions.ValueToOption_(row.add)}</td>`
                    ,`<td scope="row">${options_permissions.ValueToOption_(row.modify)}</td>`
                    ,`<td scope="row">${options_permissions.ValueToOption_(row.delete)}</td>`
                ];

                return new wtools.UIElementsPackage(`<tr permission-id="${row.id}"></tr>`, elements).Pack_();
            });
        });
    };
    settings_read_permissions();
    
    // Modify form
    $('#component_settings_general form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_settings_general form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_settings_general .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_settings_general .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_settings_general form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/forms/modify", "PUT", data, false).Exec_((response_data) =>
        {
            wait.Off_();
            
            // Manage error
            const result = new ResponseManager(response_data, '#component_settings_general .notifications', 'Formularios: Editar');
            if(!result.Verify_())
                return;

            $('#component_settings_general .notifications').html('');
            new wtools.Notification('SUCCESS', 5000, '#component_settings_general .notifications').Show_('Formulario actualizado correctamente.');

            const identifier = data.get('identifier');
            window.location.href = `/form?identifier=${identifier}#settings`
        });
    });

    // Read form to Delete
    $(document).on("click", '#component_settings_general_delete .delete', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const form_id = $('#component_settings_general input[name="id"]').val();
        const form_name = $('#component_settings_general input[name="name"]').val();

        // Setup form to delete
        $('#component_settings_delete input[name=id]').val(form_id);
        $('#component_settings_delete strong.header').html(form_name);
        $('#component_settings_delete strong.name').html(form_name);
        $('#component_settings_delete .notifications').html('');
        $('#component_settings_delete').modal('show');
        wait.Off_();
    });

    // Delete form
    $('#component_settings_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_settings_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const form_id = $('#component_settings_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/forms/delete?id=${form_id}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();

            // Manage error
            const result = new ResponseManager(response_data, '#component_settings_delete .notifications', 'Formularios: Eliminar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Formulario eliminado exitosamente.');
            window.location.href = `/start`
        });
    });
});