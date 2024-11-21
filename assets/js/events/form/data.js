
var data_read_columns = [];

$(function()
{

    // Read records
    var data_read_page = 0;
    var data_read_page_end = false;
    const data_read = (reload = false) =>
    {
        // Verify end of results
        if(data_read_page_end && reload == false)
            return;

        // Wait animation
        let wait = new wtools.ElementState('#component_data_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // URL Params
        const url_params = new URLSearchParams(window.location.search);

        // Get Form identifier
        const form_identifier = url_params.get('identifier');
        if(form_identifier == undefined)
            return;

        // Get conditions
        let conditions = ""
        if(url_params.get('conditions') != undefined)
            conditions = `&conditions=${url_params.get('conditions')}`;

        // Get order
        let order = ""
        if(url_params.get('conditions') != undefined)
            order = `&order=${url_params.get('order')}`;

        // Path request
        let path = "";
        if(reload)
        {
            const limit = $('#component_data_read table tbody')[0].rows.length;
            $('#component_data_read table tbody').html('');
            if(limit < 20)
                path = `?form-identifier=${form_identifier}&limit=20${conditions}${order}`;
            else
            path = `?form-identifier=${form_identifier}&limit=${limit}${conditions}${order}`;
        }
        else
        {
            data_read_page++;
            path = `?form-identifier=${form_identifier}&page=${data_read_page}${conditions}${order}`;
        }

        // Request
        new wtools.Request(server_config.current.api + `/forms/data/read${path}`).Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_data_read .notifications').html('');

            // Manage response
            const result = new ResponseManager(response_data, '#component_data_read .notifications', 'Data: Leer');
            if(!result.Verify_())
                return;

            // Results elements creator (Columns)
            if($('#component_data_read table thead tr').html() == "")
            {
                let keys = response_data.body.columns_meta.data;
                data_read_columns = [];
                new wtools.UIElementsCreator('#component_data_read table thead tr', keys).Build_((row) =>
                {
                    let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row, form_identifier);
                    let form_icon = form_element_object.GetIcon_(true);

                    // Add column to array
                    data_read_columns.push({id: row.id, name: row.name});
    
                    return [`<th scope="col">${form_icon}${row.name}</th>`];
                });
            }

            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                data_read_page_end = true;
                new wtools.Notification('SUCCESS', 5000, '#component_data_read .notifications').Show_('Sin m&aacute;s resultados.');
                return;
            }

            // Results elements creator (Rows)
            new wtools.UIElementsCreator('#component_data_read table tbody', response_data.body.data).Build_((row) =>
            {
                let elements = [];
                const basic_push = (row, column) => {elements.push(`<td scope="row">${row[column]}</td>`)};
                let key = 0;
                for(let column of response_data.body.columns)
                {
                    // Add row elements
                    let column_meta = response_data.body.columns_meta.data[key];
                    if(column_meta != undefined)
                    {
                        if(row[column] != "")
                        {
                            // Verify if the column is image or file
                            if(column_meta.column_type == "image")
                                elements.push(`<td scope="row"><img class="" src="/api/forms/data/file/read?filepath=${row[column]}&form-identifier=${form_identifier}" alt="${column}" width="100px"></td>`);
                            else if(column_meta.column_type == "file")
                            {
                                if(row[column].length > 10)
                                {
                                    let n = "";
                                    let max = row[column].length - 1;
                                    for(let i = max; i > max - 10; i--)
                                        n = row[column][i] + n;
                                        
                                    elements.push(`<td scope="row" max-width="100px">...${n}</td>`);
                                }
                                else
                                    elements.push(`<td scope="row" max-width="100px">${row[column]}</td>`);
                            }
                            else
                                basic_push(row, column);
                        }
                        else
                            basic_push(row, column);
                    }
                    else
                        basic_push(row, column);

                    key++;
                }

                return new wtools.UIElementsPackage(`<tr record-id="${row.ID}"></tr>`, elements).Pack_();
            });
        });
    };
    data_read();

    // Data read Pagination
    $(window).on("scroll", function()
    {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight)
        {
            if($('#component_data_read table tbody').html() != "")
                data_read();
        }
    });
    
    // Read last id
    var changeInt = 0;
    const data_read_changeInt = () =>
    {
        // Get Form identifier
        const url_params = new URLSearchParams(window.location.search);
        const form_identifier = url_params.get('identifier');

        if(form_identifier == undefined)
            return;

        // Request
        new wtools.Request(server_config.current.api + `/forms/data/read/changeInt?form-identifier=${form_identifier}`).Exec_((response_data) =>
        {
            if(response_data.body.data != undefined && response_data.body.data.length > 0)
            {
                const new_changeInt = response_data.body.data[0].change_int;
                if(changeInt != new_changeInt)
                {
                    if(changeInt != 0)
                        data_read(true);

                    changeInt = new_changeInt;
                }
            }
        });
    };
    //data_read_changeInt();
    //setInterval(data_read_changeInt, 5000);

    // Function If column type is SELECTION
    const options_link_to_init = (element, link_to_form, column_name, target, selected = undefined) => 
    {
        let options = new wtools.SelectOptions();

        new wtools.Request(server_config.current.api + `/forms/data/read?form-identifier=${link_to_form}`).Exec_((response_data) =>
        {
            try
            {
                let tmp_options = [];
                if(selected == undefined)
                    tmp_options.push(new wtools.OptionValue('', '-- Ninguno --', true));
                else
                    tmp_options.push(new wtools.OptionValue('', '-- Ninguno --', false));

                for(let row of response_data.body.data)
                {
                    const col1 = response_data.body.columns[0];
                    const col2 = response_data.body.columns[1];
                    if(selected == row[col1])
                        tmp_options.push(new wtools.OptionValue(row[col1], row[col2], true));
                    else
                        tmp_options.push(new wtools.OptionValue(row[col1], row[col2]));
                }
    
                options.options = tmp_options;
                let element_building = $(element).find('select');
                options.Build_(element_building);
            }
            catch(error)
            {
                new wtools.Notification('WARNING', 0, target).Show_(`No se pudo acceder a la columna enlazada (${column_name}).`);
            }
        });
    }
    
    // Read Form Columns to Add new record
    const read_form_columns_add = (e) =>
    {
        try
        {
            e.preventDefault();

            $('#component_data_add .notifications').html('');

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

            // Setup data columns
            $('#component_data_add table tbody').html('');
            
            // Read and setup columns
            new wtools.Request(server_config.current.api + `/forms/columns/read?form-identifier=${form_identifier}`).Exec_((response_data) =>
            {
                // Manage response
                const result = new ResponseManager(response_data, '', 'Data: Modificar');
                if(!result.Verify_())
                    return;    

                // Handle zero results
                if(response_data.body.data.length < 1)
                {
                    wait.Off_();
                    new wtools.Notification('WARNING').Show_('Debe crear columnas para agregar registros.');
                    return;
                }
                
                // Results elements creator
                new wtools.UIElementsCreator('#component_data_add table tbody', response_data.body.data).Build_((row) =>
                {
                    if(row.identifier == "id")
                        return undefined;

                    // If column type is a NORMAL type
                    let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row, form_identifier);
                    let form_element = $(form_element_object.Get_());
                    let form_icon = form_element_object.GetIcon_();

                    if(form_element == undefined)
                    {
                        new wtools.Notification('ERROR').Show_('Error al crear un elemento de formulario.');
                        return;
                    }

                    // If column type is SELECTION
                    if(row.column_type == "selection")
                        options_link_to_init(form_element, row.link_to_form, row.name, '#component_data_add .notifications');

                    // Final elements
                    let elements = [
                        `<th scope="row">${form_icon}${row.name}</th>`
                        ,form_element
                    ];

                    return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
                });

                wait.Off_();
                $('#component_data_add form').removeClass('was-validated');
                $('#component_data_add').modal('show');
            });

        }
        catch(error)
        {
            new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error: ${error}.`);
            return;
        }
    };
    $('.data_add').click((e) => read_form_columns_add(e));
    
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
            
            // Manage response
            const result = new ResponseManager(response_data, '#component_data_add .notifications', 'Data: A&ntilde;adir');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Registro guardado.');
            $('#component_data_add').modal('hide');
            data_read_page_end = false;
            data_read(true);
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
            $('#component_data_modify .notifications').html('');
            
            // Read form to modify
            new wtools.Request(server_config.current.api + `/forms/data/read/id?id=${data_id}&form-identifier=${form_identifier}`).Exec_((response_data) =>
            {
                // Manage response
                const result = new ResponseManager(response_data, '', 'Data: Modificar');
                if(!result.Verify_())
                {
                    wait.Off_();
                    return;
                }
    
                // Handle no results or zero results
                // if(response_data.body.data.length < 1 || response_data.body.columns_meta != undefined)
                if(response_data.body.data.length < 1)
                {
                    wait.Off_();
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
                    let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row, form_identifier);
                    let form_element = $(form_element_object.Get_());
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

                    // If column type is SELECTION
                    if(row.column_type == "selection")
                        options_link_to_init(form_element, row.link_to_form, row.name, '#component_data_modify .notifications', row.value);

                    let elements = [
                        `<th scope="row">${form_icon}${row.name}</th>`
                        ,form_element
                    ];

                    return new wtools.UIElementsPackage('<tr></tr>', elements).Pack_();
                });

                wait.Off_();
                $('#component_data_modify form').removeClass('was-validated');
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
            
            // Manage response
            const result = new ResponseManager(response_data, '#component_data_modify .notifications', 'Data: Modificar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Registro Actualizado.');
            $('#component_data_modify').modal('hide');
            data_read(true);
        });
    });

    // Read record to Delete
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
    
    // Delete record
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
            
            // Manage response
            const result = new ResponseManager(response_data, '#component_data_delete .notifications', 'Data: Eliminar');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Registro eliminado.');
            $('#component_data_delete').modal('hide');
            $('#component_data_modify').modal('hide');
            data_read(true);
        });
    });
    
});