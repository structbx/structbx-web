
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
    
    // Logout
    $(document).on('click', '#logout-button', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Request
        new wtools.Request(server_config.current.api + "/system/logout", "POST").Exec_((response_data) =>
        {
            wait.Off_();

            // Notifications
            if(response_data.status == 200)
            {
                window.location.href = "/login/";
            }
            else
            {
                new wtools.Notification('WARNING').Show_('No se pudo cerrar la sesi&oacute;n.');
            }
        });
    });
    
    $(document).on('click', '.go-start-button', function()
    {
        window.location.href = "/start/";
    });
    $(document).on('click', '.go-form-button', function()
    {
        window.location.href = `/form?identifier=${wtools.GetUrlSearchParam('identifier')}`;
    });
    $(document).on('click', '.go-spaces-button', function()
    {
        window.location.href = "/administration#spaces";
    });
    $(document).on('click', '.go-my-account-button', function()
    {
        window.location.href = "/administration#my_account";
    });
    $(document).on('click', '.go-instance-button', function()
    {
        window.location.href = "/administration#instance";
    });
    $(document).on('click', '.go-users-button', function()
    {
        window.location.href = "/administration#users";
    });
    $(document).on('click', '.go-groups-button', function()
    {
        window.location.href = "/administration#groups";
    });
    $(document).on('click', '.go-permissions-button', function()
    {
        window.location.href = "/administration#permissions";
    });
});
