$(function()
{
    // Read Current Organization
    const organization_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_organization_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + `/organizations/read`).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_organization_read .notifications', 'Espacios: Modificar');
            if(!result.Verify_())
                return;
            
            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING', '#component_organization_read .notifications').Show_('No se pudo acceder a la informaci&oacute;n de la organizaci&oacute;n.');
                return;
            }

            $('#component_organization_read input[name="name"]').val(response_data.body.data[0].name);
        });
    };
    organization_read();
    
    // Modify organization
    $('#component_organization_read form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_organization_read form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_organization_read .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_organization_read .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_organization_read form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/organizations/modify", "PUT", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_organization_read .notifications', 'Organizaci&oacute;n: Modificar');
            if(!result.Verify_())
                return;
            
            new wtools.Notification('SUCCESS').Show_('Organizaci&oacute;n modificada exitosamente.');
            location.reload();
        });
    });
    
});