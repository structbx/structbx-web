$(function()
{
    // Out of the views
    const out_view = () =>
    {
        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        // Construir la URL completa
        const url = `/form?identifier=${form_identifier}`;
        
        // Redirigir a la URL
        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        location.href = url;
    };
    $('#component_data_views .out-view').click(() => out_view());

    // Read current view
    const read_current_view = () =>
    {
        // Get view name
        const view_name = wtools.GetUrlSearchParam('view');
        if(view_name == undefined)
        {
            $('#component_data_views .out-view').hide();
            return;
        }

        $('.form_view').text(` (${view_name})`);
    };
    read_current_view();

    // Read Views
    const views_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_data_views .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        // Request
        new wtools.Request(server_config.current.api + `/forms/views/read?form-identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_data_views .notifications').html('');
            $('#component_data_views .contents').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#component_data_views .notifications', 'Vistas: Leer');
            if(!result.Verify_())
                return;

            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_data_views .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_data_views .notifications').html('');
            $('#component_data_views .contents').html('');
            new wtools.UIElementsCreator('#component_data_views .contents', response_data.body.data).Build_((row) =>
            {
                return `
                    <div class="p-0 dropdown-item d-flex align-items-center" style="cursor:pointer;">
                        <a class="py-2 ps-4 text-dark text-decoration-none flex-fill me-2" view-id="${row.id}" href="#">
                            ${row.name}
                        </a>
                        <div class="py-2 pe-4 btn-group" role="group">
                            <button type="button" class="btn btn-sm btn-secondary modify" view-id="${row.id}"><i class="fas fa-pen"></i></button>
                            <button type="button" class="btn btn-sm btn-secondary delete" view-id="${row.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });
        });
    };
    views_read();
    
    $(document).on('click', '#component_data_views .dropdown-item a', (e) =>
    {
        e.preventDefault();
        // Get view id
        const view_id = $(e.currentTarget).attr('view-id');
        if(view_id == undefined)
        {
            new wtools.Notification('ERROR').Show_('No se encontr&oacute; la vista.');
            return;
        }

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = "/start";
        }

        // Request
        new wtools.Request(server_config.current.api + `/forms/views/read/id?id=${view_id}&form-identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Manage response
            const result = new ResponseManager(response_data, '#component_data_views .notifications', 'Vistas: Leer');
            if(!result.Verify_())
                return;

            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS').Show_('Hubo un error al consultar la vista.');
                return;
            }

            // Construir la URL completa
            const row = response_data.body.data[0];
            const url = `/form?identifier=${form_identifier}&conditions=${row.conditions}&order=${row.order}&view=${row.name}`;
            
            // Redirigir a la URL
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = url;
        });
    });
});