
$(function ()
{
    // Read current Space
    const spaces_read_id = () =>
    {
        // Request
        new wtools.Request(server_config.current.api + "/spaces/read/id").Exec_((response_data) =>
        {
            if(response_data.status != 200)
                return;
            
            $("#space_name").html(response_data.body.data[0].name);
            console.log(response_data.body.data[0].name)
        });
    };
    spaces_read_id();
    
    // Read spaces
    const spaces_read = () =>
    {
        // Request
        new wtools.Request(server_config.current.api + "/spaces/read").Exec_((response_data) =>
        {
            if(response_data.status != 200)
                return;
            
            // Results elements creator
            $('#space_all_spaces').html('');

            // Table
            new wtools.UIElementsCreator('#space_all_spaces', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<a class="dropdown-item" href="#" space_id="${row.id}">${row.name}</a>`
                ];

                return new wtools.UIElementsPackage('<li></li>', elements).Pack_();
            });
        });
    };
    spaces_read();
});
