$(function()
{

    // SELECT options
    const options_states = new wtools.SelectOptions
    ([
        new wtools.OptionValue("activo", "Activo", true)
        ,new wtools.OptionValue("inactivo", "Inactivo")
    ]);
    options_states.Build_('#component_forms_add select[name="state"]');
    options_states.Build_('#component_forms_modify select[name="state"]');

    const options_privacity = new wtools.SelectOptions
    ([
        new wtools.OptionValue("publico", "P&uacute;blico", true)
        ,new wtools.OptionValue("interno", "Interno")
    ]);
    options_privacity.Build_('#component_forms_add select[name="privacity"]');
    options_privacity.Build_('#component_forms_modify select[name="privacity"]');

    // Read
    const form_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_forms_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_forms_read .notifications').html('');
            $('#component_forms_read .contents').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#component_forms_read .notifications', 'Formularios: Leer');
            if(!result.Verify_())
                return;

            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 5000, '#component_forms_read .notifications').Show_('Sin resultados.');
                return;
            }
            
            // Results elements creator
            $('#component_forms_read .contents').html('');
            let elements = []; let cont = 0;
            for(let row of response_data.body.data)
            {
                if(cont < 2)
                {
                    elements.push(`
                        <div class="d-flex align-items-start btn btn-simple">
                            <a href="/form?identifier=${row.identifier}" class="btn text-start mb-2 flex-grow-1">
                                <div class="border-left-secondary">
                                    <span>${row.name}</span>
                                    <p class="text-muted">${row.description}</p>
                                    <div class="mt-2">
                                        <span class="badge bg-secondary me-2"><i class="fas fa-key"></i> ${row.identifier}</span>
                                        <span class="badge bg-secondary me-2"><i class="fas fa-pen"></i> ${row.total}</span>
                                        <span class="badge bg-secondary me-2"><i class="fas fa-calendar"></i> ${row.created_at}</span>
                                    </div>
                                </div>
                            </a>
                            <div class="btn-group align-self-center" role="group">
                                <a href="/form/columns?identifier=${row.identifier}" class="btn btn-dark-shadow"><i class="fas fa-columns"></i></a>
                                <a href="/form/settings?identifier=${row.identifier}" class="btn btn-dark-shadow"><i class="fas fa-cog"></i></a>
                            </div>
                        </div>
                    `);
                }
                else
                {
                    let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                    $('#component_forms_read .contents').append(ui_element);
                    cont = 0;
                    elements = [];
                }
            }
            if(elements.length > 0)
            {
                let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                $('#component_forms_read .contents').append(ui_element);
            }
        });
    };
    form_read();
    
    // Click on Add Button
    const click_add_button = () =>
    {
        $('#component_forms_add .notifications').html('');
        $('#component_forms_add').modal('show');
    }
    $('.form_add').click(() => click_add_button());

    // Add
    $('#component_forms_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_forms_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_forms_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_forms_add form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/forms/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage error
            const result = new ResponseManager(response_data, '#component_forms_add .notifications', 'Formularios: A&ntilde;adir');
            if(!result.Verify_())
                return;
            
            new wtools.Notification('SUCCESS').Show_('Formulario creado exitosamente.');
            $('#component_forms_add').modal('hide');
            wtools.CleanForm('#component_forms_add form');
            $('#component_forms_add form').removeClass('was-validated');
            form_read();
        });
    });
});