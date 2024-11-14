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

    // Read Users
    const users_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_users_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + `/organizations/users/read`).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_users_read .notifications', 'Usuarios: Leer');
            if(!result.Verify_())
                return;
            
            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING', '#component_users_read .notifications').Show_('No se pudo acceder a los usuarios.');
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
    users_read();
    $('#component_users_read .update').click(() => users_read());
    
    // Read Current User
    const users_read_current = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_my_account_general .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + `/organizations/users/current/read`).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_my_account_general .notifications', 'Usuario actual: Leer');
            if(!result.Verify_())
                return;
            
            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING', '#component_my_account_general .notifications').Show_('No se pudo acceder al usuario actual.');
                return;
            }

            $('#component_my_account_general input[name="username"]').val(response_data.body.data[0].username);

        });
    };
    users_read_current();
    
    // Modify current user
    $('#component_my_account_general form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_my_account_general form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_my_account_general .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_my_account_general .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_my_account_general form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/organizations/users/current/username/modify", "PUT", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_my_account_general .notifications', 'Usuario actual: Modificar');
            if(!result.Verify_())
                return;
            
            $('#component_my_account_general .notifications').html('');
            new wtools.Notification('SUCCESS').Show_('Usuario actual modificado exitosamente.');
        });
    });
    
    // Modify password of current user
    $('#component_my_account_change_password form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_my_account_change_password form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_my_account_change_password .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_my_account_change_password .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_my_account_change_password form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/organizations/users/current/password/modify", "PUT", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_my_account_change_password .notifications', 'Contrase&ntilde;a: Modificar');
            if(!result.Verify_())
                return;
            
            $('#component_my_account_change_password .notifications').html('');
            new wtools.Notification('SUCCESS').Show_('Contrase&ntilde;a modificada exitosamente.');
            wtools.CleanForm($('#component_my_account_change_password form')[0]);
            $('#component_my_account_change_password form').removeClass('was-validated');
        });
    });
    
});