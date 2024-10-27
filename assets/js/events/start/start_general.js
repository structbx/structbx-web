
$(function ()
{
    // Verify Session
    let verify_session = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Request
        new wtools.Request(server_config.current.api + "/system/login", "POST").Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                window.location.href = "/login/";
                return;
            }

            wait.Off_();
        });
    };
    verify_session();

    // Elements
    new Sidebars().SidebarMenu_();
    new Headers().Header_();
    new Footers().Footer_();
    new wtools.MenuManager('.sidebar_menu', true);
        
    // Read spaces
    const spaces_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#space_all_spaces', false, 'button', new wtools.WaitAnimation().for_button);

        // Request
        new wtools.Request(server_config.current.api + "/spaces/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#space_all_spaces').html('');

            // Manage error
            if(response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING').Show_('No se pudo acceder a los espacios.');
                return;
            }
            
            // Results elements creator
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
    
});