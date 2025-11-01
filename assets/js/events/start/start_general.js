
$(function ()
{
    // Verify Session
    let verify_session = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Request
        new wtools.Request(server_config.current.api + "/auth/login", "POST").Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
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
    new wtools.MenuManager('#menu_main', true);
        
    // Read databases
    const databases_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_sidebar_databases .contents', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/databases/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_sidebar_databases .contents').html('');

            // Manage error
            const result = new ResponseManager(response_data, '');
            if(!result.Verify_())
                return;
            
            // Results elements creator
            new wtools.UIElementsCreator('#component_sidebar_databases .contents', response_data.body.data).Build_((row) =>
            {
                let element = '';
                if($('.database_name').html() == row.name)
                {
                    element = `
                        <div class="nav-item">
                            <a class="nav-link mb-2 active" href="#" database_id="${row.id}">
                                <i class="fas fa-building"></i>
                                <span class="ms-2">${row.name}</span>
                            </a>
                        </div>
                    `
                }
                else
                {
                    element = `
                        <div class="nav-item">
                            <a class="nav-link mb-2" href="#" database_id="${row.id}">
                                <i class="fas fa-building"></i>
                                <span class="ms-2">${row.name}</span>
                            </a>
                        </div>
                    `
                }

                return new wtools.UIElementsPackage('<li></li>', [element]).Pack_();
            });
        });
    };
    databases_read();

    // Change current database
    $(document).on("click", '#component_sidebar_databases .contents a', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const new_data = new FormData();
        new_data.append("id_database", $(e.currentTarget).attr('database_id'));

        // Read dashboard to modify
        new wtools.Request(server_config.current.api + `/databases/change`, "POST", new_data).Exec_((response_data) =>
        {
            // Manage error
            const result = new ResponseManager(response_data, '');
            if(!result.Verify_())
                return;
            
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            location.reload();

            wait.Off_();
        });
    });
    
});