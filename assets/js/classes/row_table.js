
class RowTable
{
    constructor(data)
    {
        this.data = data;
        this.customs = []
    }
    Build_ = (table, custom_rows_lambda) =>
    {
        for(let row of this.data)
        {
            let tr = $('<tr></tr>');

            let fields = custom_rows_lambda(row);

            for(let field of fields)
                $(tr).append($(field));

            $(table).append(tr);
        }
    }
}