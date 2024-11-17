$(function()
{
    // SELECT options

    const get_space_identifier = () =>
    {
        const url_params = new URLSearchParams(window.location.search);
        const space_identifier = url_params.get('identifier');

        if(space_identifier == undefined)
        {
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del espacio.');
            return;
        }
        return space_identifier;
    }
    let options_users = new wtools.SelectOptions();
    const options_users_init = (options, callback) => new wtools.Request(server_config.current.api + `/spaces/users/out/read?identifier_space=${get_space_identifier()}`).Exec_((response_data) =>
    {
        try
        {
            let tmp_options = [];
            for(let row of response_data.body.data)
                tmp_options.push(new wtools.OptionValue(row.id, row.username));

            options.options = tmp_options;
            options.Build_('#component_users_add select[name="username"]');
            callback();
        }
        catch(error)
        {
            new wtools.Notification('WARNING', 0, '#component_users_add .notifications').Show_('No se pudo acceder a los usuarios.');
        }
    });
    options_users_init(options_users, () => {})

    // Read Users
    const users_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_users_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + `/spaces/users/read`).Exec_((response_data) =>
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
                    ,`<td scope="row">${row.created_at}</td>`
                ];

                return new wtools.UIElementsPackage(`<tr user-id="${row.id}"></tr>`, elements).Pack_();
            });
        });
    };
    users_read();
    
    // Click on Add User button
    $('#component_users_read .add').click(() => 
    {
        $('#component_users_add').modal('show');
    });

    // Add User
    $('#component_users_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_users_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_users_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_users_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_users_add form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/organizations/users/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_users_add .notifications', 'Usuarios: A&ntilde;adir');
            if(!result.Verify_())
                return;
            
            new wtools.Notification('SUCCESS').Show_('Usuario creado exitosamente.');
            users_read();
            wtools.CleanForm($('#component_users_add form'));
            $('#component_users_add').modal('hide');
        });
    });
    
    // Read user to Delete
    $('#component_users_modify .delete').click((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Data
        let data = new FormData($('#component_users_modify form')[0]);
        const id = data.get('id');
        const username = data.get('username');
        console.log(username)

        // Setup data to delete
        $('#component_users_delete input[name=id]').val(id);
        $('#component_users_delete strong.username').html(username);
        $('#component_users_delete').modal('show');
        wait.Off_();
    });
    
    // Delete user
    $('#component_users_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_users_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const id = $('#component_users_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/organizations/users/delete?id=${id}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();
            
            // Manage response
            const result = new ResponseManager(response_data, '#component_users_delete .notifications', 'Usuarios: Eliminar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Usuario eliminado.');
            $('#component_users_delete').modal('hide');
            $('#component_users_modify').modal('hide');
            users_read();
        });
    });
    
});