
$(function ()
{

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
            $("#space_name").html(response_data.body.data[0].name);
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
        
});
