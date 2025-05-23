$(function()
{
    // Out of the views
    const out_view = () =>
    {
        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        // Build URL params
        const url = new URL(window.location.href);
        url.searchParams.delete('conditions');
        url.searchParams.delete('order');
        url.searchParams.delete('view');
        history.pushState({}, '', url.toString());

        // Reload data
        $('#component_data_reload').click();
        $('.form_view').text('');
        $('#component_data_views .out-view').addClass('d-none');
    };
    $('#component_data_views .out-view').click(() => out_view());

    // Read current view
    const read_current_view = () =>
    {
        // Get view id
        const view_id = wtools.GetUrlSearchParam('view');
        if(view_id == undefined)
        {
            $('.form_view').text('');
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
                console.log('error')
                new wtools.Notification('WARNING').Show_('Hubo un error al consultar la vista.');
                return;
            }

            // Set the current view
            const row = response_data.body.data[0];
            $('.form_view').text(` (${row.name})`);
            $('#component_data_views .out-view').removeClass('d-none');
        });
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
                return;

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
                            <button type="button" class="btn btn-sm btn-secondary modify" view-id="${row.id}" view-name="${row.name}"><i class="fas fa-pen"></i></button>
                            <button type="button" class="btn btn-sm btn-secondary delete" view-id="${row.id}" view-name="${row.name}"><i class="fas fa-trash"></i></button>
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
            const row = response_data.body.data[0];

            // Build URL params
            const url = new URL(window.location.href);
            url.searchParams.set('identifier', form_identifier);
            url.searchParams.set('conditions', row.conditions);
            url.searchParams.set('order', row.order);
            url.searchParams.set('view', row.id);
            history.pushState({}, '', url.toString());

            // Reload data
            $('#component_data_reload').click();
            read_current_view();
        })
    });

    // Add a view
    $('#component_data_views .add').click(() => 
    {
        $('#component_data_views_add').modal('show');
    });
    
    $('#component_data_views_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_data_views_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_data_views_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_data_views_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_data_views_add form')[0]);
        data.append('conditions', wtools.GetUrlSearchParam('conditions'));
        data.append('order', wtools.GetUrlSearchParam('order'));
        data.append('form-identifier', form_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/forms/views/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_data_views_add .notifications', 'Vistas: A&ntilde;adir');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Vista creada exitosamente.');
            $('#component_data_views_add').modal('hide');
            views_read();
        });
    });

    // Modify a view
    $(document).on('click', '#component_data_views .contents .modify', (e) => 
    {
        const view_id = $(e.currentTarget).attr('view-id');
        const view_name = $(e.currentTarget).attr('view-name');
        if(view_id == undefined || view_name == undefined)
        {
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; la vista.');
            return;
        }
        $('#component_data_views_modify input[name="name"]').val(view_name);
        $('#component_data_views_modify input[name="id"]').val(view_id);
        $('#component_data_views_modify').modal('show');
    });

    $('#component_data_views_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_data_views_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_data_views_modify .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_data_views_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_data_views_modify form')[0]);
        data.append('conditions', wtools.GetUrlSearchParam('conditions'));
        data.append('order', wtools.GetUrlSearchParam('order'));
        data.append('form-identifier', form_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/forms/views/modify", "PUT", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_data_views_modify .notifications', 'Vistas: Modificar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Vista modificada exitosamente.');
            $('#component_data_views_modify').modal('hide');
            views_read();
        });
    });

    // Delete a view
    $(document).on('click', '#component_data_views .contents .delete', (e) => 
    {
        const view_id = $(e.currentTarget).attr('view-id');
        const view_name = $(e.currentTarget).attr('view-name');
        if(view_id == undefined || view_name == undefined)
        {
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; la vista.');
            return;
        }
        $('#component_data_views_delete .name').text(view_name);
        $('#component_data_views_delete input[name="id"]').val(view_id);
        $('#component_data_views_delete').modal('show');
    });

    $('#component_data_views_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_data_views_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_data_views_delete .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_data_views_delete .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Request
        const current_view = wtools.GetUrlSearchParam('view');
        const view_id = $('#component_data_views_delete input[name="id"]').val();
        new wtools.Request(server_config.current.api + `/forms/views/delete?id=${view_id}&form-identifier=${form_identifier}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_data_views_delete .notifications', 'Vistas: Modificar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Vista eliminada exitosamente.');
            $('#component_data_views_delete').modal('hide');
            views_read();
            if(current_view == view_id)
                out_view();
        });
    });
});