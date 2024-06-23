$(function()
{
    // Functions Add Toggle
        $('#functions_general_add_btn').click(e =>
        {
            $('#functions_general_read').toggle();
            $('#functions_general_add').toggle();
        });
        $('#functions_general_add_back');

    // Functions Value of Filter

    $('#btn_functions_add_filter_value').click(e =>
        {
            let element = $(`
                <tr>
                    <td><input type="text" class="form-control"></td></td>
                    <td>
                        <select class="form-select" name="workspace_type">
                            <option value="1">Texto</option>
                            <option value="2">Entero</option>
                        </select>
                    </td>
                </tr>
            `);
            $('#btn_functions_add_filter_values_table tbody').append(element);
        });

});