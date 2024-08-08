$(function()
{

    // General
    const general_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_organization_general .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/organization/general/read/id").Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                $(':input','#component_organization_general form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                wait.Off_();
                new wtools.Notification('WARNING', 0, '#component_organization_general .notifications').Show_('No se pudo acceder a la informaci&oacute;n general de la organizaci&oacute;n.');
                return;
            }
            
            $('#component_organization_general input[name="id"]').val(response_data.body.data[0].id);
            $('#component_organization_general input[name="name"]').val(response_data.body.data[0].name);
            $('#component_organization_general textarea[name="description"]').val(response_data.body.data[0].description);

            wait.Off_();
        });
    };
    general_read();

    // Modify organization
    $('#component_organization_general form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_organization_general form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_organization_general .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_organization_general .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const new_data = new FormData();
        new_data.append("name", $('#component_organization_general input[name="name"]').val());
        new_data.append("description", $('#component_organization_general textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/organization/general/modify/id", "PUT", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS', 5000, '#component_organization_general .notifications').Show_('Organizaci&oacute;n modificado exitosamente.');
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_organization_general .notifications').Show_('Hubo un error al modificar la organizaci&oacute;n: ' + response_data.body.message);
            }
        });
    });
});