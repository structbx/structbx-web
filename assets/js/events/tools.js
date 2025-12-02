
// Read instance name
var instance_name_read = () =>
{
    // Wait animation
    let wait = new wtools.ElementState('#instance_name', false, 'button', new wtools.WaitAnimation().for_button);

    // Request
    new wtools.Request(server_config.current.api + "/general/instanceName/read").Exec_((response_data) =>
    {
        // Clean
        wait.Off_();

        // Manage error
        if(response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
        {
            new wtools.Notification('WARNING').Show_('No se pudo acceder al nombre de la instancia.');
            return;
        }
        
        // Setup database name
        $("#instance_name").html(response_data.body.data[0].value);
    });
};

// Read current Database
var databases_read_id = () =>
{
    // Wait animation
    let wait = new wtools.ElementState('#database_name', false, 'button', new wtools.WaitAnimation().for_button);

    // Request
    new wtools.Request(server_config.current.api + "/databases/read/id").Exec_((response_data) =>
    {
        // Clean
        wait.Off_();

        // Manage error
        if(response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
        {
            new wtools.Notification('WARNING').Show_('No se pudo acceder a la base de datos.');
            return;
        }
        
        // Setup database name
        $(".database_name").html(response_data.body.data[0].name);
    });
};

// Read username logued
var username_logued_read = () =>
{
    // Wait animation
    let wait = new wtools.ElementState('#instance_name', false, 'button', new wtools.WaitAnimation().for_button);

    // Request
    new wtools.Request(server_config.current.api + "/general/users/current/read").Exec_((response_data) =>
    {
        // Clean
        wait.Off_();

        // Manage error
        if(response_data.status == 403 || response_data.status == 401 || response_data.status != 200 || response_data.body.data == undefined || response_data.body.data.length < 1)
        {
            logout();
            return;
        }
        
        // Setup username logued
        $(".username_logued").html(response_data.body.data[0].username);
    });
};

// Logout
var logout = () =>
{
    // Wait animation
    let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

    // Request
    new wtools.Request(server_config.current.api + "/auth/logout", "POST").Exec_((response_data) =>
    {
        wait.Off_();

        // Notifications
        if(response_data.status == 200)
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = "/login/";
        }
        else
        {
            new wtools.Notification('WARNING').Show_('No se pudo cerrar la sesi&oacute;n.');
        }
    });
}

var GetTableIdentifier = () =>
{
    // Get Form identifier
    const table_identifier = wtools.GetUrlSearchParam('identifier');
    if(table_identifier == undefined)
    {
        new wtools.Notification('ERROR').Show_('No se encontr&oacute; el identificador de la tabla.');
        return undefined;
    }
    return table_identifier;
}
