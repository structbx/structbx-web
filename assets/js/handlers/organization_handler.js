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
            
            $('#component_organization_general input[name="name"]').val(response_data.body.data[0].name);
            $('#component_organization_general textarea[name="description"]').val(response_data.body.data[0].description);

            wait.Off_();
        });
    };
    general_read();
    
});