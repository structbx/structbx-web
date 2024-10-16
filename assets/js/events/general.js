
$(function ()
{
    // Read current Space
    const spaces_read_id = () =>
    {
        // Request
        new wtools.Request(server_config.current.api + "/spaces/read/id").Exec_((response_data) =>
        {
            if(response_data.status != 200)
                return;
            
            // Handle no results or zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING').Show_('No se pudo acceder al espacio.');
                return;
            }
            
            $("#space_name").html(response_data.body.data[0].name);
        });
    };
    spaces_read_id();
    
    // Read spaces
    const spaces_read = () =>
    {
        // Request
        new wtools.Request(server_config.current.api + "/spaces/read").Exec_((response_data) =>
        {
            if(response_data.status != 200)
                return;
            
            // Results elements creator
            $('#space_all_spaces').html('');

            // Table
            new wtools.UIElementsCreator('#space_all_spaces', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<a class="dropdown-item" href="#" space_id="${row.id}">${row.name}</a>`
                ];

                return new wtools.UIElementsPackage('<li></li>', elements).Pack_();
            });
        });
    };
    spaces_read();

    // Change current space
    $(document).on("click", '#space_all_spaces a', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Data
        let current_space = $('#space_name').html();
        let new_space = $(e.target).html();

        if(current_space == new_space)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('Elije un espacio diferente al actual.');
            return;
        }

        // Form data
        const new_data = new FormData();
        new_data.append("id_space", $(e.target).attr('space_id'));

        // Read dashboard to modify
        new wtools.Request(server_config.current.api + `/spaces/change`, "POST", new_data).Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo cambiar el espacio actual.');
                return;
            }
            
            location.reload();

            wait.Off_();
        });
    });

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
