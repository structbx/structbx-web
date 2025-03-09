$(function()
{
    var file_data = [];
    
    const select_options = () =>
    {
        let options = "";
        for(let column of data_read_columns)
        {
            options += `<option value="${column.identifier}">${column.name}</option>`;
        }
        options += `<option value="">-- SKIP --</option>`;
        return options;
    }

    // Read file
    const read_file = () =>
    {
        const file = $('#component_data_import input[name=file]');
        const separator = $('#component_data_import select[name=separator]').val();

        new CSVReader(file, separator).Read((state, data) =>
        {
            // Manage response error
            if(state == "ERROR")
            {
                $('#component_data_import .notifications').html('');
                new wtools.Notification('WARNING', 5000, '#component_data_import .notifications').Show_(data);
                return;
            }

            file_data = data;
            setup_map_columns();
        });
    }

    // Setup map columns
    const setup_map_columns = () =>
    {
        // Clean map table
        $('#component_data_import table.map tbody').html('');

        for(let header of Object.keys(file_data[0]))
        {
            // Setup column select
            let select = $(`<select class="form-select column" name="${header}">${select_options()}</select>`);
            $(select).val(header);
            if($(select).val() == undefined) $(select).val(''); // Fix for select

            // Add row to map table
            let row = $('<tr></tr>');
            row.append(`<th scope="row">${header}</th>`);
            row.append($('<td></td>').append(select));
            $('#component_data_import table.map tbody').append(row);
        }

        previsualize_data();
    }

    // Previsualize data
    const previsualize_data = () =>
    {
        // Clean previsualization table
        $('#component_data_import table.previsualization thead tr').html('');
        $('#component_data_import table.previsualization tbody').html('');

        // Enable columns
        let enabled_columns = [];
        $("#component_data_import .map .column").each(function()
        {
            if($(this).val() != '')
                enabled_columns.push($(this).val());
        });

        // Previsualize data
        let cont = 0;
        for(let row of file_data)
        {
            if(cont > 5)
                break;

            // Setup Header
            if(cont == 0)
            {
                let headers = "";
                for(let header of Object.keys(row))
                {
                    if(enabled_columns.includes(header))
                        headers += `<th>${header}</th>`;
                }
                $('#component_data_import table.previsualization thead tr').append(headers);
            }

            // Setup Data
            let elements = "";
            for(let header of Object.keys(row))
            {
                if(enabled_columns.includes(header))
                    elements += `<td>${row[header]}</td>`;
            }
            $('#component_data_import table.previsualization tbody').append(`<tr>${elements}</tr>`);
            cont++;
        }
    }

    // Import Data
    $('.data_import').click((e) =>
    {
        e.preventDefault();

        $('#component_data_import').modal('show');
    });

    // Input file change
    $('#component_data_import input[name=file]').change(() => read_file());
    $('#component_data_import select[name=separator]').change(() => read_file());
    $(document).on('change', '#component_data_import select.column', () => previsualize_data());
});