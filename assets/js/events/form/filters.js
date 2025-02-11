$(function()
{
    // Setup filters tables
    $("#component_data_filter_conditions tbody").sortable();
    $("#component_data_filter_order tbody").sortable();

    // Condition Element
    const ConditionElement = () =>
    {
        return $(`
            <tr class="ui-state-default">
                <td><a class="btn"><i class="fas fa-sort"></i></a></td>
                <td>
                    <select class="form-select" name="column" required>
                    </select>
                </td>
                <td>
                    <select class="form-select" name="condition" required>
                        <option value="LIKE">Contiene</option>
                        <option value="=">Igual</option>
                        <option value=">">Mayor que</option>
                        <option value="<">Menor que</option>
                        <option value=">=">Mayor o igual que</option>
                        <option value="<=">Menor o igual que</option>
                    </select>
                </td>
                <td><input type="text" class="form-control" name="value" required/></td>
                <td><button type="button" class="btn-close" aria-label="Close"></button></td>
            </tr>
        `);
    }

    // Order Element
    const OrderElement = () =>
    {
        return $(`
            <tr class="ui-state-default">
                <td><a class="btn"><i class="fas fa-sort"></i></a></td>
                <td>
                    <select class="form-select" name="column" required>
                    </select>
                </td>
                <td>
                    <select class="form-select" name="order" required>
                        <option value="ASC">Ascendente</option>
                        <option value="DESC">Descendente</option>
                    </select>
                </td>
                <td><button type="button" class="btn-close" aria-label="Close"></button></td>
            </tr>
        `);
    }
    
    // Read filters from URL
    const read_filters_from_path = () =>
    {
        try
        {
            // Clean
            $('#component_data_filter_conditions tbody').html('');
            $('#component_data_filter_order tbody').html('');

            // Get Form identifier
            const conditions = wtools.GetUrlSearchParam('conditions');
            const order = wtools.GetUrlSearchParam('order');

            if(conditions != undefined && conditions != "")
            {
                let condition_decoded = atob(conditions);
                let conditions_array = condition_decoded.split('AND');

                for(let current_condition of conditions_array)
                {
                    let column = "";
                    let condition = "";
                    let value = "";
                    let count = 0;
                    for(let char of current_condition)
                    {
                        if(count == 0){count++;continue;}
                        if(count == 1)
                        {
                            if(char == " "){count++; continue;}
                            column += char;
                        }
                        else if(count == 2)
                        {
                            if(char == " "){count++; continue;}
                            condition += char;
                        }
                        else if(count == 3)
                        {
                            value += char;
                        }
                    }
                    column = column.replace("_structbx_column_", "");
                    value = value.replaceAll("'", "");
                    value = value.replaceAll("%", "");
                    value = value.slice(0, value.length - 1);
                    add_element_condition(column, condition, value);
                }
            }
            if(order != undefined && order != "")
            {
                let order_decoded = atob(order);
                for(let it of order_decoded.split(','))
                {
                    let it_split = it.split(' ');
                    const column = it_split[0].replace("_structbx_column_", "");
                    const order = it_split[1];
                    add_element_order(column, order);
                }
            }
        }
        catch(error)
        {
            new wtools.Notification('SUCCESS', 5000, '#component_data_filter .notifications').Show_('No se pudieron decodificar los filtros actuales.');
        }
    }

    // Show filter modal
    const show_filter_modal = (e) =>
    {
        e.preventDefault();

        read_filters_from_path();
        $('#component_data_filter').modal('show');
    }
    $('.data_filter').click(e => show_filter_modal(e));

    // Remove elements
    $(document).on('click', '#component_data_filter table .btn-close', e => 
    {
        e.preventDefault();
        $(e.currentTarget).parent().parent().remove();
    });

    // Add elements conditions
    const add_element_condition = (column = undefined, condition = undefined, value = undefined) =>
    {
        // Create row filter
        let row = ConditionElement()

        // Setup row 'columns'
        for(let column of data_read_columns)
        {
            $(row).find('select[name=column]').append($(`<option value="${column.id}">${column.name}</option>`))
        }
        if(column != undefined)
        {
            $(row).find('select[name=column]').val(column);
        }
        if(condition != undefined)
        {
            $(row).find('select[name=condition]').val(condition);
        }
        if(value != undefined)
        {
            $(row).find('input[name=value]').val(value);
        }

        // Add row filter
        $('#component_data_filter_conditions tbody').append(row);
    }

    $('#component_data_filter .add_condition').click(e => 
    {
        e.preventDefault();
        add_element_condition();
    });

    // Add elements order
    const add_element_order = (column = undefined, order = undefined) =>
    {
        // Create row filter
        let row = OrderElement();

        // Setup row 'columns'
        for(let column of data_read_columns)
        {
            $(row).find('select[name=column]').append($(`<option value="${column.id}">${column.name}</option>`))
        }
        if(column != undefined)
        {
            $(row).find('select[name=column]').val(column);
        }
        if(order != undefined)
        {
            $(row).find('select[name=order]').val(order);
        }

        // Add row filter
        $('#component_data_filter_order tbody').append(row);
    }

    $('#component_data_filter .add_order').click(e => 
    {
        e.preventDefault();
        add_element_order();
    });

    // Apply filters to URL
    const apply_filters = () =>
    {
        let conditions = [];
        let orders = [];
        
        // Iterate over conditions
        $('#component_data_filter_conditions tbody tr').each(function()
        {
            const column = $(this).find('select[name="column"]').val();
            const condition = $(this).find('select[name="condition"]').val();
            const value = $(this).find('input[name="value"]').val();
        
            // Add parameter to the array
            switch(condition)
            {
                case 'LIKE':
                    conditions.push(` _structbx_column_${column} ${condition} '%${value}%' `);
                    break;
                case '=':
                case '>':
                case '<':
                case '>=':
                case '<=':
                    conditions.push(` _structbx_column_${column} ${condition} '${value}' `);
                    break;
            }
        });
        
        // Iterate over orders
        $('#component_data_filter_order tbody tr').each(function()
        {
            const column = $(this).find('select[name="column"]').val();
            const order = $(this).find('select[name="order"]').val();
        
            // Add parameter to the array
            orders.push(`_structbx_column_${column} ${order}`);
        });
        
        // Join the parameters
        const conditions_query = conditions.join('AND');
        const orders_query = orders.join(',');
        
        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = "/start";
        }

        // Construir la URL completa
        const url = `/form?identifier=${form_identifier}&conditions=${btoa(conditions_query)}&order=${btoa(orders_query)}#data`;
        
        // Redirigir a la URL
        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        window.location.href = url;
    }

    // Submit filters
    $('#component_data_filter form').submit(e => 
    {
        e.preventDefault();

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_data_filter .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_data_filter .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        apply_filters();
    });

    // Reset filters
    $('#component_data_filter .reset_filters').click(e => 
    {
        e.preventDefault();
        
        // Get Form identifier
        const form_identifier = wtools.GetUrlSearchParam('identifier');
        if(form_identifier == undefined)
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = "/start";
        }

        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        window.location.href = `/form?identifier=${form_identifier}`;
    });
});