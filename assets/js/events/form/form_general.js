
$(function ()
{
    // Verify Session
    /*let verify_session = () =>
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
    verify_session();*/

    // Elements
        new Sidebars().SidebarMenuForm_();
        new Headers().HeaderForm_();
        new Footers().Footer_();
        new wtools.MenuManager('.sidebar_menu', true);
    
    // Drag and drop Interface Design
    $("#component_interface_design_columns, #component_interface_design_layout").sortable({connectWith: ".connectedSortable"})
    .disableSelection();

    // Click on Drag and drop item
    $('.form-design-item').click((e) =>
    {
        const element = e.currentTarget.id;
        $('#component_interface_design_item_design input[name="element"]').val(element);
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
});