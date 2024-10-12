$(function()
{

    // Read records
    const data_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_data_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
            return;

        // Request
        new wtools.Request(server_config.current.api + `/forms/data/read?identifier=${form_identifier}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_data_read .notifications').html('');
            $('#component_data_read table thead tr').html('');
            $('#component_data_read table tbody').html('');

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 0, '#component_data_read .notifications').Show_('No tiene permisos para acceder a este recurso.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 0, '#component_data_read .notifications').Show_('No se pudo acceder a la data de este formulario.');
                return;
            }

            // Handle no results or zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_data_read .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator (Rows)
            new wtools.UIElementsCreator('#component_data_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [];
                for(let column of response_data.body.columns)
                {
                    elements.push(`<td scope="row">${row[column]}</td>`);
                }

                return new wtools.UIElementsPackage(`<tr record-id="${row.ID}"></tr>`, elements).Pack_();
            });

            // Results elements creator (Columns)
            let keys = response_data.body.columns_meta.data;
            new wtools.UIElementsCreator('#component_data_read table thead tr', keys).Build_((row) =>
            {
                let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row);
                let form_icon = form_element_object.GetIcon_();

                return [`<th scope="col">${form_icon}${row.name}</th>`];
            });
            
        });
    };
    data_read();
    $('#component_data_read .update').click(() => data_read());
    
    // Read Form Columns to Add new record
    $(document).on("click", '#component_data_read .add', (e) =>
    {
        try
        {
            e.preventDefault();

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Get Form identifier
            const url_params = new URLSearchParams(window.location.search);
            const form_identifier = url_params.get('identifier');

            if(form_identifier == undefined)
            {
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
                return;
            }

            // Setup form to modify
            $('#component_data_add table tbody').html('');
            
            // Read form to modify
            new wtools.Request(server_config.current.api + `/forms/data/columns/read?identifier=${form_identifier}`).Exec_((response_data) =>
            {
                // Permissions error
                if(response_data.status == 401)
                {
                    new wtools.Notification('WARNING').Show_('No tiene permisos para acceder a este recurso.');
                    return;
                }

                // Notification Error
                if(response_data.status != 200)
                {
                    new wtools.Notification('WARNING').Show_('No se pudo acceder a la data de este formulario.');
                    return;
                }

                // Handle no results or zero results
                if(response_data.body.data == undefined || response_data.body.data.length < 1)
                {
                    new wtools.Notification('SUCCESS').Show_('Sin resultados.');
                    return;
                }
                
                // Results elements creator
                new wtools.UIElementsCreator('#component_data_add table tbody', response_data.body.data).Build_((row) =>
                {
                    let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row);
                    let form_element = form_element_object.Get_();
                    let form_icon = form_element_object.GetIcon_();

                    if(form_element == undefined)
                    {
                        new wtools.Notification('ERROR').Show_('Error al crear un elemento de formulario.');
                        return;
                    }

                    let elements = [
                        `<th scope="row">${form_icon}${row.name}</th>`
                        ,form_element
                    ];

                    return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
                });

                wait.Off_();
                $('#component_data_add').modal('show');
            });

        }
        catch(error)
        {
            new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error: ${error}.`);
            return;
        }
    });
    
    // Add record
    $('#component_data_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_data_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_data_add .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_data_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Data collection
        let new_data = new FormData($('#component_data_add form')[0]);
        new_data.append('form-identifier', form_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/forms/data/add", "POST", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Registro guardado.');
                $('#component_data_add').modal('hide');
                data_read();
            }

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 5000, '#component_data_add .notifications').Show_('No tiene permisos para guardar registros en este formulario.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 5000, '#component_data_add .notifications').Show_('No se pudo guardar el nuevo registro.');
                return;
            }
        });
    });
    
    // Read columns and data to modify
    $(document).on("click", '#component_data_read table tbody tr', (e) =>
    {
        try
        {
            e.preventDefault();

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Get Form identifier
            const url_params = new URLSearchParams(window.location.search);
            const form_identifier = url_params.get('identifier');
            if(form_identifier == undefined)
            {
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
                return;
            }

            // Get Data ID
            let data_id = $(e.currentTarget).attr('record-id');
            if(data_id == undefined)
            {
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del registro.');
                return;
            }

            // Setup form to modify
            $('#component_data_modify table tbody').html('');
            
            // Read form to modify
            new wtools.Request(server_config.current.api + `/forms/data/read/id?id=${data_id}&form-identifier=${form_identifier}`).Exec_((response_data) =>
            {
                // Permissions error
                if(response_data.status == 401)
                {
                    new wtools.Notification('WARNING').Show_('No tiene permisos para acceder a este recurso.');
                    return;
                }

                // Notification Error
                if(response_data.status != 200)
                {
                    new wtools.Notification('WARNING').Show_('No se pudo acceder a la data de este formulario.');
                    return;
                }

                // Handle no results or zero results
                if(response_data.body.data == undefined || response_data.body.data.length < 1 || response_data.body.columns_meta.data < 1)
                {
                    new wtools.Notification('SUCCESS').Show_('Sin resultados.');
                    return;
                }

                // Add values to columns_data
                let data = response_data.body.columns_meta.data;
                for(let it of data)
                {
                    it.value = response_data.body.data[0][it.name];
                }

                // Results elements creator
                new wtools.UIElementsCreator('#component_data_modify table tbody', data).Build_((row) =>
                {
                    let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row);
                    let form_element = form_element_object.Get_();
                    let form_icon = form_element_object.GetIcon_();

                    if(form_element == undefined)
                    {
                        new wtools.Notification('ERROR').Show_('Error al crear un elemento de formulario.');
                        return;
                    }

                    if(row.identifier == "id")
                    {
                        $('#component_data_modify input[name="id"]').val(data_id);
                        return;
                    }

                    let elements = [
                        `<th scope="row">${form_icon}${row.name}</th>`
                        ,form_element
                    ];

                    return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
                });

                wait.Off_();
                $('#component_data_modify').modal('show');
            });

        }
        catch(error)
        {
            new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error: ${error}.`);
            return;
        }
    });
    
    // Modify record
    $('#component_data_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_data_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_data_modify .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_data_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Data collection
        let new_data = new FormData($('#component_data_modify form')[0]);
        new_data.append('form-identifier', form_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/forms/data/modify", "PUT", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Registro Actualizado.');
                $('#component_data_modify').modal('hide');
                data_read();
            }

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 5000, '#component_data_modify .notifications').Show_('No tiene permisos para modificar registros en este formulario.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 5000, '#component_data_modify .notifications').Show_('No se pudo modificar el registro.');
                return;
            }
        });
    });

    // Read form to Delete
    $('#component_data_modify .delete').click((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Data
        let data = new FormData($('#component_data_modify form')[0]);
        const data_id = data.get('id');

        // Setup data to delete
        $('#component_data_delete input[name=id]').val(data_id);
        $('#component_data_delete strong.id').html(data_id);
        $('#component_data_delete').modal('show');
        wait.Off_();
    });
    
    // Delete data
    $('#component_data_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_data_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
        {
            wait.Off_();
            new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
            return;
        }

        // Data
        const data_id = $('#component_data_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/forms/data/delete?id=${data_id}&form-identifier=${form_identifier}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Registro eliminado.');
                $('#component_data_delete').modal('hide');
                $('#component_data_modify').modal('hide');
                data_read();
            }

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 5000, '#component_data_delete .notifications').Show_('No tiene permisos para eliminar registros en este formulario.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 5000, '#component_data_delete .notifications').Show_('No se pudo eliminar el registro.');
                return;
            }
        });
    });
    
});