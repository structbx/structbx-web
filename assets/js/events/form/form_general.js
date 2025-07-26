
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
                window.location.href = "../login/";
                return;
            }

            wait.Off_();
        });
    };
    verify_session();

    // Elements
        new Headers().Header_();
    
    // Read Header Form
    const form_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#form_name', false, 'button', new wtools.WaitAnimation().for_button);

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = "../start/";
            return;
        }

        // Request
        new wtools.Request(server_config.current.api + `/forms/read/identifier?identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#form_name').html('');

            // Permissions error
            // Manage response
            const result = new ResponseManager(response_data, '#wait_animation_page', 'Data: A&ntilde;adir');
            if(!result.Verify_())
            {
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
                window.location.href = "/start/";
                return;
            }
            
            // Setup form name
            const form = response_data.body.data[0].name;
            if(form == undefined)
            {
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
                window.location.href = "/start/";
            }
            else
            {
                $('#form_name').html(form);
                $('.form_title').html(form);
            }
        });
    };
    form_read();
    
    // Read all Sidebar forms
    const form_sidebar_read_all = () =>
    {
        $('#component_sidebar_forms .contents').html('');

        // Wait animation
        let wait = new wtools.ElementState('#component_sidebar_forms .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        // Request
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_sidebar_forms .notifications').html('');
            $('#component_sidebar_forms .contents').html('');
            $('#component_sidebar_forms_tabs .notifications').html('');
            $('#component_sidebar_forms_tabs .contents').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#component_sidebar_forms .notifications', '');
            if(!result.Verify_())
                return;

            // Handle zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_sidebar_forms .notifications').Show_('Sin resultados.');
                new wtools.Notification('SUCCESS', 0, '#component_sidebar_forms_tabs .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator: Sidebar
            $('#component_sidebar_forms .contents').html('');
            let elements = [];
            for(let row of response_data.body.data)
            {
                elements.push(`
                    <a class="menu_data nav-link mb-2 ${row.identifier == form_identifier ? "active" : ""}" href="/form?identifier=${row.identifier}">
                        <i class="fas fa-database"></i>
                        <span class="ms-2">${row.name}</span>
                    </a>
                `);
            }
            let ui_element = new wtools.UIElementsPackage('<div class="nav-item"></div>', elements).Pack_();
            $('#component_sidebar_forms .contents').append(ui_element);

            // Results elements creator: Tabs
            $('#component_sidebar_forms_tabs .tab-scroller').html('');
            for(let row of response_data.body.data)
            {
                $('#component_sidebar_forms_tabs .tab-scroller').append(`
                    <div class="tab ${row.identifier == form_identifier ? "active" : ""}" id="${row.identifier}" data-tab-id="${row.identifier}">
                        <span class="tab-title">${row.name}</span>
                    </div>
                `);
            }
        });
    };
    form_sidebar_read_all();

    // Go to Form data
    $(document).on('click', '.go_form', (e) =>
    {
        e.preventDefault();

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        document.location.href = `/form?identifier=${form_identifier}`;

    });
    
    // Go to Columns settings
    $(document).on('click', '.go_columns', (e) =>
    {
        e.preventDefault();

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        document.location.href = `/form/columns?identifier=${form_identifier}`;

    });

    // Go to Form Settings
    $(document).on('click', '.go_settings', (e) =>
    {
        e.preventDefault();

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        document.location.href = `/form/settings?identifier=${form_identifier}`;

    });
    
});