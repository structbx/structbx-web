$(function()
{

    const ReadTableInfo = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('.form-title', false, 'button', new wtools.WaitAnimation().for_button);

        // Get Form identifier
        const table_identifier = wtools.GetUrlSearchParam('identifier');
        if(table_identifier == undefined)
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = "/start/";
            return;
        }

        // Request
        new wtools.Request(server_config.current.api + `/forms/tables/read/identifier?table-identifier=${table_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('.form-title').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#wait_animation_page', 'Data: A&ntilde;adir');
            if(!result.Verify_())
            {
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
                //window.location.href = "/start/";
                return;
            }
            
            // Setup form name
            const form = response_data.body.data[0].name;
            if(form == undefined)
            {
                new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
                //window.location.href = "/start/";
            }
            else
            {
                $('.form-title').html(form);
            }
        });
    };
    ReadTableInfo();

    const ReadDataColumns = function()
    {
        try
        {
            $('#component_form_addData .notifications').html('');

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Get Form identifier
            const table_identifier = GetTableIdentifier();
            if(table_identifier == undefined)
                return;

            // Setup data columns
            $('#component_form_addData table tbody').html('');
            
            // Read and setup columns
            new wtools.Request(server_config.current.api + `/forms/columns/read?table-identifier=${table_identifier}`).Exec_((response_data) =>
            {
                try
                {
                    // Manage response
                    const result = new ResponseManager(response_data, '', 'Formulario: Columnas: Leer');
                    if(!result.Verify_())
                    {
                        wait.Off_();
                        new wtools.ElementState('#wait_animation_page', true, 'block', 
                            `<div class="d-flex justify-content-center align-items-center position-fixed top-0 w-100 h-100 bg-white" style="z-index: 100000;">
                                <h4 class="ms-4 fw-bold">
                                    <img src="/assets/images/logo-150x150.png" alt="StructBX Logo" width="50" height="50" class="d-inline-block align-text-top me-2">
                                    No se puede acceder al formulario, ve a <a href="/">Inicio</a>
                                </h4>
                            </div>`
                        );
                        return;    
                    }

                    // Handle zero results
                    if(response_data.body.data.length < 1)
                    {
                        wait.Off_();
                        new wtools.Notification('WARNING').Show_('Debe crear columnas para agregar registros.');
                        return;
                    }
                    
                    // Results elements creator
                    new wtools.UIElementsCreator('#component_form_addData table tbody', response_data.body.data).Build_((row) =>
                    {
                        if(row.identifier == "id")
                            return undefined;

                        // If column type is a NORMAL type
                        let table_element_object = new TableElements(wtools.IFUndefined(row.column_type, "text"), row, table_identifier);
                        let table_element = $(table_element_object.Get_());
                        let table_icon = table_element_object.GetIcon_();

                        if(table_element == undefined)
                        {
                            new wtools.Notification('ERROR').Show_('Error al crear un elemento de tabla.');
                            return;
                        }

                        // If column type is SELECTION
                        if(row.column_type == "selection")
                            OptionsLinkSelection(table_element, row.link_to_table, row.name, '#component_form_addData .notifications');
                        else if(row.column_type == "user")
                            OptionsLinkUsersInDatabase(table_element, '#component_form_addData .notifications');

                        // Final elements
                        let elements = [
                            `<th scope="row">${table_icon}${row.name}</th>`
                            ,table_element
                        ];

                        return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
                    });

                    wait.Off_();
                    $('#component_form_addData form').removeClass('was-validated');


                }
                catch(error)
                {
                    new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error: ${error}.`);
                    return;
                }
            });

        }
        catch(error)
        {
            new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error: ${error}.`);
            return;
        }
    };
    ReadDataColumns();
});