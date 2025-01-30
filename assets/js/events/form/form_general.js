
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
                window.location.href = "../login/";
                return;
            }

            wait.Off_();
        });
    };
    verify_session();

    // Elements
        new Sidebars().SidebarMenuForm_();
        new Footers().Footer_();
    
    // Drag and drop Interface Design
    $("#component_interface_design_columns, #component_interface_design_layout").sortable({connectWith: ".connectedSortable"})
    .disableSelection();

    // Click on Drag and drop item
    $('.form-design-item').click((e) =>
    {
        const element = e.currentTarget.id;
        $('#component_interface_design_item_design input[name="element"]').val(element);
        $('#component_interface_design_item_design input[name="label"]').val(element);
        $('#component_interface_design_item_design select[name="size"]').attr("disabled", false);
        for(let html_class of $(`#${element}`)[0].classList)
        {
            if(html_class == "col-md-12") $('#component_interface_design_item_design select[name="size"]').val("12");
            if(html_class == "col-md-11") $('#component_interface_design_item_design select[name="size"]').val("11");
            if(html_class == "col-md-10") $('#component_interface_design_item_design select[name="size"]').val("10");
            if(html_class == "col-md-9") $('#component_interface_design_item_design select[name="size"]').val("9");
            if(html_class == "col-md-8") $('#component_interface_design_item_design select[name="size"]').val("8");
            if(html_class == "col-md-7") $('#component_interface_design_item_design select[name="size"]').val("7");
            if(html_class == "col-md-6") $('#component_interface_design_item_design select[name="size"]').val("6");
            if(html_class == "col-md-5") $('#component_interface_design_item_design select[name="size"]').val("5");
            if(html_class == "col-md-4") $('#component_interface_design_item_design select[name="size"]').val("4");
            if(html_class == "col-md-3") $('#component_interface_design_item_design select[name="size"]').val("3");
            if(html_class == "col-md-2") $('#component_interface_design_item_design select[name="size"]').val("2");
            if(html_class == "col-md-1") $('#component_interface_design_item_design select[name="size"]').val("1");
        }
    });

    // Change size of Drag and drop item
    $('#component_interface_design_item_design select[name="size"]').change((e) =>
    {
        const element = $('#component_interface_design_item_design input[name="element"]').val();
        const new_size = $(e.currentTarget).val();

        // Remove classes
        for(let i = 1; i < 13; i++)
            $(`#${element}`).removeClass(`col-md-${i}`);

        // Add class
        $(`#${element}`).addClass(`col-md-${new_size}`);
    });

    // Read Header Form
    const form_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#form_name', false, 'button', new wtools.WaitAnimation().for_button);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
        {
            window.location.href = "../start/#forms";
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
                // Wait animation
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        
                window.location.href = "/start/#forms";
                return;
            }
            
            // Setup form name
            const form = response_data.body.data[0].name;
            if(form == undefined)
            {
                // Wait animation
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        
                window.location.href = "/start/#forms";
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
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        // Request
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_sidebar_forms .notifications').html('');
            $('#component_sidebar_forms .contents').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#component_sidebar_forms .notifications', '');
            if(!result.Verify_())
                return;

            // Handle zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_sidebar_forms .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator
            $('#component_sidebar_forms .contents').html('');
            let elements = [];
            for(let row of response_data.body.data)
            {
                if(row.identifier == form_identifier)
                {
                    elements.push(`
                        <a class="menu_data nav-link mb-2 active" href="/form?identifier=${row.identifier}">
                            <i class="fas fa-database"></i>
                            <span class="ms-2">${row.name}</span>
                        </a>
                    `);
                }
                else
                {
                    elements.push(`
                        <a class="menu_data nav-link mb-2" href="/form?identifier=${row.identifier}">
                            <i class="fas fa-database"></i>
                            <span class="ms-2">${row.name}</span>
                        </a>
                    `);
                }
            }
            let ui_element = new wtools.UIElementsPackage('<div class="nav-item"></div>', elements).Pack_();
            $('#component_sidebar_forms .contents').append(ui_element);
        });
    };
    form_sidebar_read_all();

    // Go to Form data
    $(document).on('click', '.go_form', (e) =>
    {
        e.preventDefault();

        // URL Params
        const url_params = new URLSearchParams(window.location.search);

        // Get Form identifier
        const form_identifier = url_params.get('identifier');
        if(form_identifier == undefined)
            return;

        document.location.href = `/form?identifier=${form_identifier}`;

    });
    
    // Go to Columns settings
    $(document).on('click', '.go_columns', (e) =>
    {
        e.preventDefault();

        // URL Params
        const url_params = new URLSearchParams(window.location.search);

        // Get Form identifier
        const form_identifier = url_params.get('identifier');
        if(form_identifier == undefined)
            return;

        document.location.href = `/form/columns?identifier=${form_identifier}`;

    });

    // Go to Form Settings
    $(document).on('click', '.go_settings', (e) =>
    {
        e.preventDefault();

        // URL Params
        const url_params = new URLSearchParams(window.location.search);

        // Get Form identifier
        const form_identifier = url_params.get('identifier');
        if(form_identifier == undefined)
            return;

        document.location.href = `/form/settings?identifier=${form_identifier}`;

    });
    
});