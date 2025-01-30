$(function()
{
    // Read Groups
    const groups_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_groups_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + `/general/groups/read`).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_groups_read .notifications', 'Grupos: Leer');
            if(!result.Verify_())
                return;
            
            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING', '#component_groups_read .notifications').Show_('No se pudo acceder a los grupos.');
                return;
            }

            // Results elements creator
            $('#component_groups_read .notifications').html('');
            $('#component_groups_read table tbody').html('');
            new wtools.UIElementsCreator('#component_groups_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    ,`<td scope="row">${row.id}</td>`
                    ,`<td scope="row">${row.group}</td>`
                    ,`<td scope="row">${row.created_at}</td>`
                ];

                return new wtools.UIElementsPackage(`<tr group-id="${row.id}"></tr>`, elements).Pack_();
            });
        });
    };
    groups_read();
    
    // Click on Add Group button
    $('#component_groups_read .add').click(() => 
    {
        $('#component_groups_add').modal('show');
    });

    // Add Group
    $('#component_groups_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_groups_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_groups_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_groups_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_groups_add form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/general/groups/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_groups_add .notifications', 'Grupos: A&ntilde;adir');
            if(!result.Verify_())
                return;
            
            new wtools.Notification('SUCCESS').Show_('Grupo agregado exitosamente.');
            groups_read();
            wtools.CleanForm($('#component_groups_add form'));
            $('#component_groups_add').modal('hide');
        });
    });
    
});