
$(function ()
{
    // Verify Session
    let verify_session = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Request
        new wtools.Request(server_config.current.api + "/system/login", "POST").Exec_((response_data) =>
        {
            if(response_data.status == 200)
            {
                window.location.href = "../start/";
                return;
            }

            wait.Off_();
        });
    };
    verify_session();

    // Login
    $('#component_login form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_login form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_login .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_login .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData();
        data.append("username", $('#component_login input[name="user"]').val());
        data.append("password", $('#component_login input[name="password"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/system/login", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();
            $('#component_login .notifications').html('');

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Inicio de sesi&oacute;n exitoso. Espere...');
                window.location.href = "../start/";
            }
            else if(response_data.status == 401)
            {
                new wtools.Notification('ERROR', 0, '#component_login .notifications').Show_("Usuario o contrase&ntilde;a incorrectos.");
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_login .notifications').Show_("Error al iniciar sesi&oacute;n");
            }
        });
    });

});