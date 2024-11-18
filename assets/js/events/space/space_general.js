$(function()
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

    // Elements]
    new Sidebars().SidebarMenuSpace_();
    new Headers().HeaderSpace_();
    new Footers().Footer_();
    new wtools.MenuManager('#menu_main', true);

    // Read current space
    const spaces_read_id = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_space_modify .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const space_identifier = url_params.get('identifier');
        if(space_identifier == undefined)
        {
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del espacio.');
            return;
        }

        // Request
        new wtools.Request(server_config.current.api + `/spaces/read/id?identifier=${space_identifier}`).Exec_((response_data) =>
        {
            // Manage response
            const result = new ResponseManager(response_data, '#component_space_modify .notifications', 'Espacios: Modificar');
            if(!result.Verify_())
                return;
            
            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('WARNING', '#component_space_modify .notifications').Show_('No se pudo acceder a la informaci&oacute;n general del espacio.');
                return;
            }

            $('#component_space_modify input[name="id"]').val(response_data.body.data[0].id);
            $('#component_space_modify input[name="identifier"]').val(response_data.body.data[0].identifier);
            $('#component_space_modify input[name="name"]').val(response_data.body.data[0].name);
            $('#component_space_modify textarea[name="description"]').val(response_data.body.data[0].description);

            wait.Off_();
        });
    };
    spaces_read_id();
    
    // Modify space
    $('#component_space_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_space_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_space_modify .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_space_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_space_modify form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/spaces/modify", "PUT", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_space_modify .notifications', 'Espacios: Modificar');
            if(!result.Verify_())
                return;
            
            const space_identifier = data.get('identifier');
            new wtools.Notification('SUCCESS').Show_('Espacio modificado exitosamente.');
            window.location.href = `/space?identifier=${space_identifier}#space`;
        });
    });

    // Read form to Delete
    $(document).on("click", '#component_space_delete .delete', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const form_id = $('#component_space_modify input[name="id"]').val();
        const form_name = $('#component_space_modify input[name="name"]').val();

        // Setup form to delete
        $('#component_space_delete_final input[name=id]').val(form_id);
        $('#component_space_delete_final strong.header').html(form_name);
        $('#component_space_delete_final strong.name').html(form_name);
        $('#component_space_delete_final .notifications').html('');
        $('#component_space_delete_final').modal('show');
        wait.Off_();
    });

    // Delete form
    $('#component_space_delete_final form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_space_delete_final form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const space_id = $('#component_space_delete_final input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/spaces/delete?id=${space_id}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();

            // Manage error
            const result = new ResponseManager(response_data, '#component_space_delete_final .notifications', 'Espacios: Eliminar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Espacio eliminado exitosamente.');
            window.location.href = `/start`
        });
    });
});