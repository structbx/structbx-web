
function OptionsLinkSelection(element, link_to_table, column_name, target, selected = undefined, public_form = 0)
{
    let options = new wtools.SelectOptions();

    new wtools.Request(server_config.current.api + `/tables/data/read?table-identifier=${link_to_table}&public_form=${public_form}`).Exec_((response_data) =>
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

function OptionsLinkUsersInDatabase(element, target, selected = undefined)
{
    let options = new wtools.SelectOptions();

    new wtools.Request(server_config.current.api + `/databases/users/current/read`).Exec_((response_data) =>
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
                if(selected == row.id)
                    tmp_options.push(new wtools.OptionValue(row.id, row.username, true));
                else
                    tmp_options.push(new wtools.OptionValue(row.id, row.username));
            }

            // Build <option>s
            options.options = tmp_options;
            let element_building = $(element).find('select');
            options.Build_(element_building);
        }
        catch(error)
        {
            new wtools.Notification('WARNING', 0, target).Show_(`No se pudo acceder a los usuarios de la base de datos.`);
        }
    });
}

class Data
{
    changeInt = 0;
    changeIntInit = false;
    data_read_page = 1;
    data_read_limit = 20;
    data_read_page_end = false;
    data_read_columns = [];
    users_in_database = {};
    read_mutex = false;

    constructor()
    {
        this.ReadUsersInDatabase_(() => this.Read_());
        setInterval(this.ChangeIntVerification_.bind(this), 5000);
    }

    CreateRows_(response_data, row)
    {
        let elements = [];

        // Basic <td> row
        const basic_row = (row, column) =>
        {
            elements.push(`<td class="bg-white" scope="row">${row[column]}</td>`)
        };
        // User <td> row
        const user_row = (row, column) =>
        {
            if(this.users_in_database[row[column]] != undefined)
                elements.push(`<td class="bg-white" scope="row">${this.users_in_database[row[column]]}</td>`);
            else
                elements.push(`<td class="bg-white" scope="row">${row[column]}</td>`);
        };
        // Image <td> row
        const image_row = (row, column) =>
        {
            elements.push(`<td class="bg-white" scope="row"><img class="" src="/api/tables/data/file/read?filepath=${row[column]}&table-identifier=${GetTableIdentifier()}" alt="${column}" width="100px"></td>`);
        };
        // File <td> row
        const file_row = (row, column) =>
        {
            if(row[column].length > 10)
            {
                // Setup text less than 10 characters
                let new_content = "";
                let max = row[column].length - 1;
                for(let i = max; i > max - 10; i--)
                    new_content = row[column][i] + new_content;
                    
                elements.push(`<td class="bg-white" scope="row">...${new_content}</td>`);
            }
            else
                basic_row(row, column);
        };

        // Loop in columns
        let key = 0;
        for(let column of response_data.body.columns)
        {
            // Setup columns meta
            let column_meta = response_data.body.columns_meta.data[key];

            if(column_meta != undefined && row[column] != "")
            {
                // Verify column type
                if(column_meta.column_type == "image")
                    image_row(row, column);
                else if(column_meta.column_type == "file")
                    file_row(row, column);
                else if(column_meta.column_type == "user" || column_meta.column_type == "current-user")
                    user_row(row, column);
                else
                    basic_row(row, column);
            }
            else
                basic_row(row, column);

            key++;
        }

        // Return <td> rows in array
        return elements;
    }

    GetPath_ = (reload, clean = true) =>
    {
        // Get Table identifier
        const table_identifier = GetTableIdentifier();
        if(table_identifier == undefined)
            return "";

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
            //this.data_read_limit = $('#component_data_read table tbody')[0].rows.length;
            this.data_read_limit = 20 * this.data_read_page;
            if(clean)
                $('#component_data_read table tbody').html('');

            // Setup path
            if(this.data_read_limit < 20)
                path = `?table-identifier=${table_identifier}&limit=20${conditions}${order}`;
            else
                path = `?table-identifier=${table_identifier}&limit=${this.data_read_limit}${conditions}${order}`;
        }
        else
        {
            // Setup path
            path = `?table-identifier=${table_identifier}&page=${this.data_read_page}${conditions}${order}`;
        }
        return path;
    }

    GetBodyData_ = (response_data) =>
    {
        if (response_data.body == undefined || response_data.body.data == undefined)
            return [];
        else
            return response_data.body.data;
    }

    FreeMutex_()
    {
        this.read_mutex = false;
    }

    Read_ = (reload = false) =>
    {
        try
        {
            // Verify mutex
            if(this.read_mutex)
                return;

            // Set mutex
            this.read_mutex = true;

            // Exit if end of results and no reload
            if(this.data_read_page_end && reload == false)
            {
                this.FreeMutex_();
                return;
            }

            // Get Table identifier
            const table_identifier = GetTableIdentifier();
            if(table_identifier == undefined)
            {
                this.FreeMutex_();
                return "";
            }

            // Get path
            const path = this.GetPath_(reload);
            if(path == "")
            {
                this.FreeMutex_();
                return;
            }

            // Wait animation
            let wait = new wtools.ElementState('#component_data_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

            // Request
            new wtools.Request(server_config.current.api + `/tables/data/read${path}`).Exec_((response_data) =>
            {
                // Get data
                let data = this.GetBodyData_(response_data);

                // Clean
                wait.Off_();
                $('#component_data_read .notifications').html('');

                // Manage response
                const result = new ResponseManager(response_data, '#component_data_read .notifications', 'Data: Leer');
                if(!result.Verify_())
                {
                    this.FreeMutex_();
                    return;
                }

                // Results elements creator (Columns)
                if($('#component_data_read table thead tr').html() == "" && response_data.body.columns_meta != undefined)
                {
                    // Variables
                    let keys = response_data.body.columns_meta.data;
                    this.data_read_columns = [];
                    let it = 0;

                    // Setup columns meta
                    new wtools.UIElementsCreator('#component_data_read table thead tr', keys).Build_((row) =>
                    {
                        // Setup columns and icon
                        let table_element_object = new TableElements(wtools.IFUndefined(row.column_type, "text"), row, table_identifier);
                        let table_icon = table_element_object.GetIcon_(false);

                        // Add column to array
                        this.data_read_columns.push({id: row.id, identifier: row.identifier, name: row.name});

                        it++;
                        
                        return [`
                            <th scope="col" class="user-select-none position-relative" data-col="${row.id}">
                                <span>${table_icon}${row.name}</span>
                                <div class="resize-handle"></div>
                            </th>
                        `];
                    });

                    // Setup table dimensions
                    let tableD = new TableDimensions(table_identifier, '#component_data_read_table');
                    tableD.Init_();
                    // Prevenir selección de texto durante el redimensionamiento
                    $(document).on('selectstart', function(e)
                    {
                        if (tableD.isResizing)
                        {
                            e.preventDefault();
                            return false;
                        }
                    });

                    // If there is less than 5 columns, add empty column
                    /*if(it < 5)
                    {
                        $('#component_data_read table thead tr').append($(`<th scope="col"  class="user-select-none" style="width: 50%;background: #f3f3f3;border-top:none !important;"></th>`));
                    }*/
                }

                // Verify if results is lower than limit
                if(data.length < this.data_read_limit)
                    this.data_read_page_end = true;

                // Handle zero results
                if(data.length < 1)
                {
                    // End of results reached
                    this.data_read_page_end = true;
                    this.FreeMutex_();
                    return;
                }

                // No end of results
                this.data_read_page_end = false;

                // Results elements creator (Rows)
                new wtools.UIElementsCreator('#component_data_read table tbody', data).Build_((row) =>
                {
                    // Create rows
                    const elements = this.CreateRows_(response_data, row);
                    return new wtools.UIElementsPackage(`<tr id="row_${row.ID}" record-id="${row.ID}"></tr>`, elements).Pack_();
                });

                // Next page if not reload
                if(!reload)
                    this.data_read_page++;

                // Free mutex
                this.FreeMutex_();
            });
        }
        catch(error)
        {
            // Free mutex
            this.FreeMutex_();

            new wtools.Notification('ERROR').Show_(`Ocurri&oacute; un error.`);
            return;
        }
    };

    RefreshRow_(row_id)
    {
        try
        {
            // Get Form identifier
            const table_identifier = GetTableIdentifier();
            if(table_identifier == undefined)
                return;

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
            new wtools.Request(server_config.current.api + `/tables/data/read/id?id=${row_id}&table-identifier=${table_identifier}${conditions}${order}`).Exec_((response_data) =>
            {
                // Manage response
                const result = new ResponseManager(response_data, '', 'Data: Leer (1)');
                if(!result.Verify_())
                    return;
    
                // Handle no results or zero results
                if(response_data.body.data.length < 1)
                    return;

                // Results elements creator (Rows)
                const elements = this.CreateRows_(response_data, response_data.body.data[0]);

                // Update row
                $('#row_' + row_id).html('');
                for(let td of elements)
                {
                    $('#row_' + row_id).append(td);
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
        const table_identifier = GetTableIdentifier();
        if(table_identifier == undefined)
            return;

        // Request
        new wtools.Request(server_config.current.api + `/tables/data/read/changeInt?changeInt=${this.changeInt}&table-identifier=${table_identifier}`).Exec_((response_data) =>
        {
            const data = response_data.body.data;
            if(data != undefined && data.length > 0)
            {
                if(!this.changeIntInit)
                {
                    // Firs init of changeInit (only update changeInt value to the last element id)
                    this.changeInt = data[data.length - 1].id;
                    this.changeIntInit = true;
                }
                else
                {
                    // If there is new changeInt, refresh rows
                    let reload = false;
                    for(let row of data)
                    {
                        this.changeInt = row.id;
                        switch(row.operation)
                        {
                            case "insert":
                                reload = true;
                                break;
                            case "update":
                                this.RefreshRow_(row.row_id);
                                break;
                            case "delete":
                                $(`#row_${row.row_id}`).remove();
                                break;
                            case "import":
                                reload = true;
                                break;
                        }
                    }
                    if(reload)
                        this.ReadUsersInDatabase_(() => this.Read_(true));
                }
            }
        });
    };

    ReadUsersInDatabase_(callback)
    {
        new wtools.Request(server_config.current.api + `/databases/users/current/read`).Exec_((response_data) =>
        {
            try
            {
                for(let row of response_data.body.data)
                    this.users_in_database[row.id] = row.username;

                return callback();
            }
            catch(error)
            {
                new wtools.Notification('WARNING').Show_(`No se pudo acceder a los usuarios de la base de datos.`);
                return;
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
            const table_identifier = GetTableIdentifier();
            if(table_identifier == undefined)
                return;

            // Setup data columns
            $('#component_data_add table tbody').html('');
            
            // Read and setup columns
            new wtools.Request(server_config.current.api + `/tables/columns/read?table-identifier=${table_identifier}`).Exec_((response_data) =>
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
                    let table_element_object = new TableElements(wtools.IFUndefined(row.column_type, "text"), row, table_identifier);
                    let table_element = $(table_element_object.Get_());
                    let table_icon = table_element_object.GetIcon_();

                    if(table_element == undefined)
                    {
                        new wtools.Notification('ERROR').Show_('Error al crear un elemento de tabla.');
                        return;
                    }

                    // If column type is SELECTION
                    if(row.column_type == "selection")
                        OptionsLinkSelection(table_element, row.link_to_table, row.name, '#component_data_add .notifications');
                    else if(row.column_type == "user")
                        OptionsLinkUsersInDatabase(table_element, '#component_data_add .notifications');

                    // Final elements
                    let elements = [
                        `<th scope="row">${table_icon}${row.name}</th>`
                        ,table_element
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

        // Get Table identifier
        const table_identifier = GetTableIdentifier();
        if(table_identifier == undefined)
        {
            wait.Off_();
            return;
        }

        // Data collection
        let new_data = new FormData($('#component_data_add form')[0]);
        new_data.append('table-identifier', table_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/tables/data/add", "POST", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            
            // Manage response
            const result = new ResponseManager(response_data, '#component_data_add .notifications', 'Data: A&ntilde;adir');
            if(!result.Verify_())
                return;

            new wtools.Notification('SUCCESS').Show_('Registro guardado.');
            $('#component_data_add').modal('hide');
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
            const table_identifier = GetTableIdentifier();
            if(table_identifier == undefined)
            {
                wait.Off_();
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
            new wtools.Request(server_config.current.api + `/tables/data/read/id?id=${data_id}&table-identifier=${table_identifier}`).Exec_((response_data) =>
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
                    let table_element_object = new TableElements(wtools.IFUndefined(row.column_type, "text"), row, table_identifier);
                    let table_element = $(table_element_object.Get_());
                    let table_icon = table_element_object.GetIcon_();

                    if(table_element == undefined)
                    {
                        new wtools.Notification('ERROR').Show_('Error al crear un elemento de tabla.');
                        return;
                    }

                    if(row.identifier == "id")
                    {
                        $('#component_data_modify input[name="id"]').val(data_id);
                        return;
                    }

                    // If column type is SELECTION
                    if(row.column_type == "selection")
                        OptionsLinkSelection(table_element, row.link_to_table, row.name, '#component_data_modify .notifications', row.value);
                    else if(row.column_type == "user")
                        OptionsLinkUsersInDatabase(table_element, '#component_data_add .notifications', row.value);

                    let elements = [
                        `<th scope="row">${table_icon}${row.name}</th>`
                        ,table_element
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
        const table_identifier = GetTableIdentifier();
        if(table_identifier == undefined)
        {
            wait.Off_();
            return;
        }

        // Data collection
        let new_data = new FormData($('#component_data_modify form')[0]);
        new_data.append('table-identifier', table_identifier);

        // Request
        new wtools.Request(server_config.current.api + "/tables/data/modify", "PUT", new_data, false).Exec_((response_data) =>
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
        const table_identifier = GetTableIdentifier();
        if(table_identifier == undefined)
        {
            wait.Off_();
            return;
        }

        // Data
        const data_id = $('#component_data_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/tables/data/delete?id=${data_id}&table-identifier=${table_identifier}`, "DEL").Exec_((response_data) =>
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
        const table_identifier = GetTableIdentifier();
        if(table_identifier == undefined)
            return;

        // Get path
        const path = this.GetPath_(true, false);
        if(path == "")
            return;

        // Request
        new wtools.Request(server_config.current.api + `/tables/data/read${path}&export=true`, ).MakeHTTPRequest()
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

    // Click on new tab
    $(document).on('click', '#component_sidebar_tables_tabs .tab-scroller .tab', (e) =>
    {
        e.preventDefault();

        // Get Form identifier
        const new_table_identifier = $(e.currentTarget).attr('table-identifier');

        // Reset URL parameters and set new form identifier
        const url = new URL(window.location.href);
        url.searchParams.delete('conditions');
        url.searchParams.delete('order');
        url.searchParams.delete('view');
        url.searchParams.set('identifier', new_table_identifier);
        history.pushState({}, '', url.toString());

        // Clear previous data
        $('#component_data_read table thead tr').html("");
        $('#component_data_read table tbody').html("");

        // New data object
        dataObject = new Data();

        // Reset views
        viewsObject.Read_();

        // Read Form
        objectTableGeneral.Read_();

        // Set to active current tab
        $('#component_sidebar_tables_tabs .tab').removeClass('active');
        $(e.currentTarget).addClass('active');
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