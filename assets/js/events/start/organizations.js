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

            wait.Off_();
        });
    };
    organization_read();
    
});