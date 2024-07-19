
$(function ()
{

    // Client Signin
        const ClientSignin = (e) =>
        {
            e.preventDefault();
            $('.login_container_message').html('');
            let check = new FormChecker("#form_session_create").Check_();
            if(!check)
            {
                new Notification('WARNING', 5000, '.login_container_message')
                .Show_(`Hay campos inv&aacute;lidos`);
                return;
            }

            const data = [{
                "user": $('#form_session_create .user').val()
                ,"password": $('#form_session_create .password').val()
            }];

            let button = new ElementState('#form_session_create button.confirm', true, 'button', new WaitAnimation().for_button);

            new Login().CreateSession(data, result =>
            {
                if(result)
                {
                    button.Off_();
                    new Notification('SUCCESS', -1, '.login_container_message')
                    .Show_(`Sesi&oacute;n iniciada, espere...`);
                    window.location.href = "../start/";
                }
                else
                {
                    button.Off_();
                    new Notification('WARNING', 10000, '.login_container_message')
                    .Show_(`Usuario o contrase&ntilde;a incorrectos.`);
                }
            });
        }
        $("#form_session_create").submit(ClientSignin);

    // Client Logout
        const ClientLogout = (e) =>
        {
            e.preventDefault();
            new Login().DeleteSession(result =>
            {
                if(result)
                {
                    new Notification('SUCCESS').Show_(`Cerrando sesi&oacute;n...`);
                    window.location.href = "../login/";
                }
                else
                    new Notification('ERROR').Show_(`Error al cerrar la sesi&oacute;n.`);
            });
        }
        $(".delete-session").click(ClientLogout);
});
