
class Data
{
    changeInt = 0;
    changeIntInit = false;
    data_read_page = 0;
    data_read_page_end = false;
    data_read_columns = [];

    constructor()
    {
        this.Read_();
        setInterval(this.ChangeIntVerification_.bind(this), 5000);
    }

    CreateRows_(response_data, row)
    {
        let elements = [];

        // Basic <td> row
        const basic_push = (row, column) => {elements.push(`<td class="bg-white" scope="row">${row[column]}</td>`)};

        // Loop in columns
        let key = 0;
        for(let column of response_data.body.columns)
        {
            // Setup columns meta
            let column_meta = response_data.body.columns_meta.data[key];

            if(column_meta != undefined)
            {
                // Verify if the column is not ""
                if(row[column] != "")
                {
                    // Verify if the column is image or file
                    if(column_meta.column_type == "image")
                        elements.push(`<td class="bg-white" scope="row"><img class="" src="/api/forms/data/file/read?filepath=${row[column]}&form-identifier=${form_identifier}" alt="${column}" width="100px"></td>`);
                    else if(column_meta.column_type == "file")
                    {
                        if(row[column].length > 10)
                        {
                            // Setup text less than 10 characters
                            let n = "";
                            let max = row[column].length - 1;
                            for(let i = max; i > max - 10; i--)
                                n = row[column][i] + n;
                                
                            elements.push(`<td class="bg-white" scope="row">...${n}</td>`);
                        }
                        else
                            elements.push(`<td class="bg-white" scope="row">${row[column]}</td>`);
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

        // Return <td> rows in array
        return elements;
    }

    Read_ = (reload = false) =>
    {
        // Exit if end of results and no reload
        if(this.data_read_page_end && reload == false)
            return;

        // Wait animation
        let wait = new wtools.ElementState('#component_data_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        // Get conditions
        let conditions = ""
        if(wtools.GetUrlSearchParam('conditions') != undefined)
            conditions = `&conditions=${wtools.GetUrlSearchParam('conditions')}`;

        // Get order
        let order = ""
        if(wtools.GetUrlSearchParam('order') != undefined)
            order = `&order=${wtools.GetUrlSearchParam('order')}`;

        // Path request
        let path = "";
        if(reload)
        {
            // Set current limit
            const limit = $('#component_data_read table tbody')[0].rows.length;
            $('#component_data_read table tbody').html('');

            // Setup path
            if(limit < 20)
                path = `?form-identifier=${form_identifier}&limit=20${conditions}${order}`;
            else
                path = `?form-identifier=${form_identifier}&limit=${limit}${conditions}${order}`;
        }
        else
        {
            // Next page
            this.data_read_page++;
            // Setup path
            path = `?form-identifier=${form_identifier}&page=${this.data_read_page}${conditions}${order}`;
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
                // Variables
                let keys = response_data.body.columns_meta.data;
                this.data_read_columns = [];
                let it = 0;

                // Setup columns meta
                new wtools.UIElementsCreator('#component_data_read table thead tr', keys).Build_((row) =>
                {
                    // Setup columns and icon
                    let form_element_object = new FormElements(wtools.IFUndefined(row.column_type, "text"), row, form_identifier);
                    let form_icon = form_element_object.GetIcon_(true);

                    // Add column to array
                    this.data_read_columns.push({id: row.id, identifier: row.identifier, name: row.name});

                    it++;
                    
                    return [`<th scope="col">${form_icon}${row.name}</th>`];
                });

                // If there is less than 5 columns, add empty column
                if(it < 5)
                {
                    $('#component_data_read table thead tr').append($(`<td scope="col" style="width: 50%;background: #CCC;"></td>`));
                }
            }

            // Handle zero results
            if(response_data.body.data.length < 1)
            {
                // End of results reached
                this.data_read_page_end = true;
                return;
            }

            // Results elements creator (Rows)
            new wtools.UIElementsCreator('#component_data_read table tbody', response_data.body.data).Build_((row) =>
            {
                // Create rows
                const elements = this.CreateRows_(response_data, row);
                return new wtools.UIElementsPackage(`<tr id="row_${row.ID}" record-id="${row.ID}"></tr>`, elements).Pack_();
            });
        });
    };

    RefreshRow_(row_id, insert = false)
    {
        try
        {
            console.log('hola')
            // Get Form identifier
            const form_identifier = wtools.GetUrlSearchParam('identifier');
            if(form_identifier == undefined)
            {
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del formulario.');
                return;
            }

            // Get Data ID
            if(row_id == undefined)
            {
                new wtools.Notification('WARNING').Show_('No se encontr&oacute; el identificador del registro.');
                return;
            }

            $('#component_data_modify .notifications').html('');
            
            // Get conditions
            let conditions = ""
            if(wtools.GetUrlSearchParam('conditions') != undefined)
                conditions = `&conditions=${wtools.GetUrlSearchParam('conditions')}`;

            // Get order
            let order = ""
            if(wtools.GetUrlSearchParam('order') != undefined)
                order = `&order=${wtools.GetUrlSearchParam('order')}`;

            // Request row
            console.log('hola1')
            new wtools.Request(server_config.current.api + `/forms/data/read/id?id=${row_id}&form-identifier=${form_identifier}${conditions}${order}`).Exec_((response_data) =>
            {
                console.log('hola2')
                // Manage response
                const result = new ResponseManager(response_data, '', 'Data: Leer (1)');
                if(!result.Verify_())
                    return;
    
                // Handle no results or zero results
                if(response_data.body.data.length < 1)
                    return;

                // Results elements creator (Rows)
                const elements = this.CreateRows_(response_data, response_data.body.data[0]);
                if(insert)
                {
                    // Insert a new row
                    const new_row = new wtools.UIElementsPackage(`<tr id="row_${response_data.body.data[0].ID}" record-id="${response_data.body.data[0].ID}"></tr>`, elements).Pack_();
                    $('#component_data_read table tbody').append(new_row);
                }
                else
                {
                    // Update row
                    $('#row_' + row_id).html('');
                    for(let td of elements)
                    {
                        $('#row_' + row_id).append(td);
                    }
                }
            });

        }
        catch(error)
        {
            new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error: ${error}.`);
            return;
        }
    };
    
    ChangeIntVerification_()
    {
        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        // Request
        new wtools.Request(server_config.current.api + `/forms/data/read/changeInt?changeInt=${this.changeInt}&form-identifier=${form_identifier}`).Exec_((response_data) =>
        {
            const data = response_data.body.data;
            if(data != undefined && data.length > 0)
            {
                if(!this.changeIntInit)
                {
                    console.log("First init of changeInt");
                    // Firs init of changeInit (only update changeInt value to the last element id)
                    this.changeInt = data[data.length - 1].id;
                    this.changeIntInit = true;
                }
                else
                {
                    console.log("changeInt");
                    // If there is new changeInt, refresh rows
                    for(let row of data)
                    {
                        this.changeInt = row.id;
                        switch(row.operation)
                        {
                            case "insert":
                                console.log("insert");
                                if(this.data_read_page_end)
                                    this.RefreshRow_(row.row_id, true);
                                break;
                            case "update":
                                console.log("update");
                                this.RefreshRow_(row.row_id);
                                break;
                            case "delete":
                                console.log("delete");
                                $(`#row_${row.row_id}`).remove();
                                break;
                            case "import":
                                this.Read_(true);
                                break;
                        }
                    }
                }
            }
        });
    };

    OptionsLinkSelection_(element, link_to_form, column_name, target, selected = undefined)
    {
        let options = new wtools.SelectOptions();

        new wtools.Request(server_config.current.api + `/forms/data/read?form-identifier=${link_to_form}`).Exec_((response_data) =>
        {
            try
            {
                let tmp_options = [];

                // Add empty <option>
                if(selected == undefined)
                    tmp_options.push(new wtools.OptionValue('', '-- Ninguno --', true));
                else
                    tmp_options.push(new wtools.OptionValue('', '-- Ninguno --', false));

                // Add select or not selected <option>
                for(let row of response_data.body.data)
                {
                    const col1 = response_data.body.columns[0];
                    const col2 = response_data.body.columns[1];
                    if(selected == row[col1])
                        tmp_options.push(new wtools.OptionValue(row[col1], row[col2], true));
                    else
                        tmp_options.push(new wtools.OptionValue(row[col1], row[col2]));
                }
    
                // Build <option>s
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

    ReadDataColumns_()
    {
        try
        {
            $('#component_data_add .notifications').html('');

            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Get Form identifier
            const form_identifier = wtools.GetUrlSearchParam('identifier');
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
                const result = new ResponseManager(response_data, '', 'Data: Columnas: Leer');
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
                        this.OptionsLinkSelection_(form_element, row.link_to_form, row.name, '#component_data_add .notifications');

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

    Add_(e)
    {
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
        const form_identifier = wtools.GetUrlSearchParam('identifier');
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
            this.data_read_page_end = false;
            this.ChangeIntVerification_();
        });
    }

    ReadDataToModify_(e)
    {
        try
        {
            // Wait animation
            let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

            // Get Form identifier
            const form_identifier = wtools.GetUrlSearchParam('identifier');
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
                        this.OptionsLinkSelection_(form_element, row.link_to_form, row.name, '#component_data_modify .notifications', row.value);

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
    }

    Modify_(e)
    {
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
        const form_identifier = wtools.GetUrlSearchParam('identifier');
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
            this.ChangeIntVerification_();
        });
    }

    ReadDataToDelete_()
    {
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
    }

    Delete_()
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_data_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');

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
            this.ChangeIntVerification_();
        });
    }

    Export_()
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_data_export .export', false, 'button', new wtools.WaitAnimation().for_button);

        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
            return;

        // Get conditions
        let conditions = ""
        if(wtools.GetUrlSearchParam('conditions') != undefined)
            conditions = `&conditions=${wtools.GetUrlSearchParam('conditions')}`;

        // Get order
        let order = ""
        if(wtools.GetUrlSearchParam('conditions') != undefined)
            order = `&order=${wtools.GetUrlSearchParam('order')}`;

        // Path request
        const limit = $('#component_data_read table tbody')[0].rows.length;
        if(limit < 20)
            path = `?form-identifier=${form_identifier}&limit=20${conditions}${order}`;
        else
        path = `?form-identifier=${form_identifier}&limit=${limit}${conditions}${order}`;

        // Request
        new wtools.Request(server_config.current.api + `/forms/data/read${path}&export=true`, ).MakeHTTPRequest()
        .then(response => response.body)
        .then(stream => 
        {
            const reader = stream.getReader();
            let content = [];

            return new ReadableStream(
            {
                async start(controller)
                {
                    while (true) 
                    {
                        const { done, value } = await reader.read();
                        if (done) break;
                        content.push(value);
                        controller.enqueue(value);
                    }
                    controller.close();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob =>
        {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            let timestamp = new Date().getTime();
            let filename = `export_${timestamp}.csv`;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);

            wait.Off_();
            new wtools.Notification('SUCCESS').Show_(`Exportaci&oacute;n exitosa`);
        })
        .catch(error => {
            new wtools.Notification('WARNING').Show_(`Error al descargar el archivo: ${error}.`);
        });
    }
}

var dataObject = new Data();

$(function()
{
    // Pagination
    $('#component_data_read .contents').on("scroll", function(e)
    {
        if(e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight)
        {
            if($('#component_data_read table tbody').html() != "")
                dataObject.Read_();
        }
    });
    
    // Data reload button
    $('#component_data_reload').click(() => dataObject.Read_(true));
    
    // Click on add data button
    $('.data_add').click((e) => 
    {
        e.preventDefault();
        dataObject.ReadDataColumns_();
    });
    
    // Add record
    $('#component_data_add form').submit((e) =>
    {
        e.preventDefault();
        dataObject.Add_(e);
    });
    
    // Read columns and data to modify
    $(document).on("click", '#component_data_read table tbody tr', (e) =>
    {
        e.preventDefault();
        dataObject.ReadDataToModify_(e);
    });
    
    // Modify record
    $('#component_data_modify form').submit((e) =>
    {
        e.preventDefault();
        dataObject.Modify_(e);
    });

    // Read record to Delete
    $('#component_data_modify .delete').click((e) =>
    {
        e.preventDefault();
        dataObject.ReadDataToDelete_(e);
    });
    
    // Delete record
    $('#component_data_delete form').submit((e) =>
    {
        e.preventDefault();
        dataObject.Delete_();
    });
    
    // Export Data
    $('.data_export').click((e) =>
    {
        e.preventDefault();
        $('#component_data_export').modal('show');
    });

    $('#component_data_export .export').click((e) =>
    {
        e.preventDefault();
        dataObject.Export_();
    });
});