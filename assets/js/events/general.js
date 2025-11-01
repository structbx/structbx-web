
$(function ()
{

    // Read instance name
    const instance_name_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#instance_name', false, 'button', new wtools.WaitAnimation().for_button);

        // Request
        new wtools.Request(server_config.current.api + "/general/instanceName/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();

            // Manage error
            if(response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING').Show_('No se pudo acceder al nombre de la instancia.');
                return;
            }
            
            // Setup space name
            $("#instance_name").html(response_data.body.data[0].value);
        });
    };
    instance_name_read();
        
    // Read current Space
    const spaces_read_id = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#space_name', false, 'button', new wtools.WaitAnimation().for_button);

        // Request
        new wtools.Request(server_config.current.api + "/spaces/read/id").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();

            // Manage error
            if(response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING').Show_('No se pudo acceder al espacio.');
                return;
            }
            
            // Setup space name
            $(".space_name").html(response_data.body.data[0].name);
        });
    };
    spaces_read_id();
    
    // Read username logued
    const username_logued_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#instance_name', false, 'button', new wtools.WaitAnimation().for_button);

        // Request
        new wtools.Request(server_config.current.api + "/general/users/current/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();

            // Manage error
            if(response_data.status == 403 || response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                logout();
                return;
            }
            
            // Setup username logued
            $(".username_logued").html(response_data.body.data[0].username);
        });
    };
    username_logued_read();
        
    // Logout
    const logout = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Request
        new wtools.Request(server_config.current.api + "/auth/logout", "POST").Exec_((response_data) =>
        {
            wait.Off_();

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
                window.location.href = "/login/";
            }
            else
            {
                new wtools.Notification('WARNING').Show_('No se pudo cerrar la sesi&oacute;n.');
            }
        });
    }
    $(document).on('click', '#logout-button', (e) =>
    {
        e.preventDefault();

        logout();
    });
    
    $(document).on('click', '.go-button', function(e)
    {
        e.preventDefault();
        let path = $(e.currentTarget).attr('go-path');
        let hash = $(e.currentTarget).attr('go-hash');
        if(window.location.pathname == path || window.location.pathname == path + "/")
        {
            location.hash = hash;
            location.reload();
        }
        else
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = path + hash;
        }
    });

    $(document).on('click', '.go-form-button', function(e)
    {
        e.preventDefault();
        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        window.location.href = `/table?identifier=${wtools.GetUrlSearchParam('identifier')}`;
    });
});
