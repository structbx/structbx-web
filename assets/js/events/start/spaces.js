$(function()
{
    // Read spaces
    const spaces_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_spaces_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + `/spaces/read`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_spaces_read .notifications').html('');
            $('#component_spaces_read table tbody').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#component_spaces_read .notifications', 'Espacios: Leer');
            if(!result.Verify_())
                return;

            // Handle no results or zero results
            if(response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_spaces_read .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator
            wait.Off_();
            $('#component_spaces_read .notifications').html('');
            $('#component_spaces_read table tbody').html('');
            new wtools.UIElementsCreator('#component_spaces_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [
                    `<th scope="row"><a href="/space?identifier=${row.identifier}">${row.identifier}</a></th>`
                    ,`<th scope="row">${row.name}</th>`
                    ,`<td scope="row">${row.description}</td>`
                    ,`<td scope="row">${row.created_at}</td>`
                ];

                return new wtools.UIElementsPackage(`<tr space-id="${row.id}"></tr>`, elements).Pack_();
            });
        });
    }
    spaces_read();
    $('#component_spaces_read .update').click(() => spaces_read());

    // Click on Add Space button
    $('#component_spaces_read .add').click(() => 
    {
        $('#component_spaces_add').modal('show');
    });

    // Add Space
    $('#component_spaces_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_spaces_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_spaces_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_spaces_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData($('#component_spaces_add form')[0]);

        // Request
        new wtools.Request(server_config.current.api + "/spaces/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Manage response
            const result = new ResponseManager(response_data, '#component_spaces_add .notifications', 'Espacios: A&ntilde;adir');
            if(!result.Verify_())
                return;
            
            new wtools.Notification('SUCCESS').Show_('Espacio creado exitosamente.');
            location.reload();
        });
    });

    // Logo
    /*(function spaces_logo()
    {
        // Modify logo
        $('#component_spaces_logo form').submit((e) =>
        {
            e.preventDefault();
    
            // Wait animation
            let wait = new wtools.ElementState('#component_spaces_logo form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);
    
            try
            {
                // Form check
                const check = new wtools.FormChecker(e.target).Check_();
                if(!check)
                {
                    trow('Hay campos inv&aacute;lidos.');
                    return;
                }
        
                // Verify elements
                const filelist = $('#component_spaces_logo input[name="logo"]')[0].files;
                if(filelist.length < 1)
                {
                    trow('Hay campos inv&aacute;lidos.');
                    return;
                }
        
                // Data collection
                const new_data = new FormData();
                new_data.append("logo", filelist[0]);
        
                // Request
                new wtools.Request(server_config.current.api + "/spaces/logo/modify", "PUT", new_data, false).Exec_((response_data) =>
                {
                    wait.Off_();
                    if(response_data.status == 200)
                    {
                        new wtools.Notification('SUCCESS', 5000, '#component_spaces_logo .notifications').Show_('Logo modificado exitosamente.');
                    }
                    else
                    {
                        new wtools.Notification('ERROR', 0, '#component_spaces_logo .notifications').Show_('Hubo un error al modificar el logo: ' + response_data.body.message);
                    }
                });
            }
            catch(error)
            {
                wait.Off_();
                $('#component_spaces_logo .notifications').html('');
                new wtools.Notification('WARNING', 5000, '#component_spaces_logo .notifications').Show_(error);
                return;
            }
        });    
    })();*/

    // Users
    (function spaces_users()
    {
        // Read
        /*const spaces_read_id = () =>
        {
            // Wait animation
            let wait = new wtools.ElementState('#component_spaces_users .notifications', false, 'block', new wtools.WaitAnimation().for_block);
    
            // Request
            new wtools.Request(server_config.current.api + "/spaces/users/read").Exec_((response_data) =>
            {
                if(response_data.status != 200)
                {
                    $(':input','#component_spaces_users form')
                        .not(':button, :submit, :reset, :hidden')
                        .val('')
                        .prop('checked', false)
                        .prop('selected', false);
                    wait.Off_();
                    new wtools.Notification('WARNING', 0, '#component_spaces_users .notifications').Show_('No se pudo acceder a la informaci&oacute;n de usuarios del espacio.');
                    return;
                }
                
                // Handle no results or zero results
                if(response_data.body.data == undefined || response_data.body.data.length < 1)
                {
                    new wtools.Notification('WARNING', '#component_spaces_general .notifications').Show_('No se pudo acceder a la informaci&oacute;n de usuarios del espacio.');
                    return;
                }

                // Results elements creator
                wait.Off_();
                $('#component_spaces_users .notifications').html('');
                $('#component_spaces_users table tbody').html('');
    
                // Table
                new wtools.UIElementsCreator('#component_spaces_users table tbody', response_data.body.data).Build_((row) =>
                {
                    let elements = [
                        `<th scope="row">${row.username}</th>`
                        ,`<td scope="row">${row.status}</td>`
                        ,`<td scope="row">${row.status}</td>`
                        ,`<td scope="row">${row.group}</td>`
                        ,`<td scope="row">${row.created_at}</td>`
                        ,`<td scope="row">
                            <div class="dropdown">
                                <a
                                    class="dropdown-toggle text-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                >
                                    <i class="fas fa-ellipsis-h"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item modify" spaces_user_id="${row.id}" spaces_user_name="${row.name}">
                                            Editar
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item delete" spaces_user_id="${row.id}" spaces_user_name="${row.name}">
                                            Eliminar
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </td>`
                    ];
    
                    return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
                });
    
            });
        };
        spaces_read_id();    */
    });
});