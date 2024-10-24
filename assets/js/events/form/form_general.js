
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
            if(response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                window.location.href = "../start/#forms";
                return;
            }
            
            // Setup form name
            const form = response_data.body.data[0].name;
            if(form == undefined)
                window.location.href = "../start/#forms";
            else
            {
                $('#form_name').html(form);
                $('#form_title').html(form);
            }
        });
    };
    form_read();
    
    // Read all Header forms
    const form_header_read_all = () =>
    {
        $('#component_title_change table tbody').html('');

        // Wait animation
        let wait = new wtools.ElementState('#component_title_change .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_title_change .notifications').html('');
            $('#component_title_change table tbody').html('');

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 0, '#component_title_change .notifications').Show_('No tiene permisos para acceder a este recurso.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 0, '#component_title_change .notifications').Show_('No se pudo acceder a los formularios.');
                return;
            }

            // Handle no results or zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_title_change .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator
            $('#component_title_change .contents').html('');
            let elements = []; let cont = 0;
            for(let row of response_data.body.data)
            {
                if(cont < 2)
                {
                    elements.push(`
                        <div class="col-12 col-sm-6 col-xxl-3 d-flex mb-4">
                            <div class="card flex-fill">
                                <div class="card-body py-4">
                                    <div class="d-flex align-items-start">
                                        <div class="flex-grow-1">
                                            <h3 class="mb-2">
                                                <a class="text-decoration-none text-dark" href="../form?identifier=${row.identifier}">
                                                    ${row.name}
                                                </a>
                                            </h3>
                                            <p class="mb-2 text-muted">Formulario</p>
                                            <div class="mb-0">
                                                <span class="badge bg-secondary me-2">${row.total} registros</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    `);
                }
                else
                {
                    let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                    $('#component_title_change .contents').append(ui_element);
                    cont = 0;
                    elements = [];
                }
            }
            if(elements.length > 0)
            {
                let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                $('#component_title_change .contents').append(ui_element);
            }
        });
    };
    form_header_read_all();

    // Click on change form
    $('#form_name').click(() => 
    {
        form_header_read_all();
        $('#component_title_change').modal('show');
    });
    
});