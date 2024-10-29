class FormElements
{
    constructor(element_type, data)
    {
        this.element_type = element_type;
        this.data = data;
    }
    Get_()
    {
        let return_element;
        switch(this.element_type)
        {
            case "text":
            {
                return_element = this.Text_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.maxlength, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "long-text":
            {
                return_element = this.LongText_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.maxlength, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "int-number":
            {
                return_element = this.IntNumber_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.maxlength, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "decimal-number":
            {
                return_element = this.DecimalNumber_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.maxlength, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "date":
            {
                return_element = this.Date_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "time":
            {
                return_element = this.Time_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "file":
            {
                return_element = this.File_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "image":
            {
                return_element = this.Image_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
            case "selection":
            {
                return_element = this.Selection_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.required, "")
                );
                break;
            }
            default:
            {
                return_element = this.Text_
                (
                    wtools.IFUndefined(this.data.identifier, "")
                    ,wtools.IFUndefined(this.data.maxlength, "")
                    ,wtools.IFUndefined(this.data.required, "")
                    ,wtools.IFUndefined(this.data.value, "")
                );
                break;
            }
        }

        return return_element;
    }
    GetIcon_()
    {
        let return_element;
        switch(this.element_type)
        {
            case "text":
            {
                return_element = '<i class="fas fa-font me-4 text-secondary"></i>';
                break;
            }
            case "long-text":
            {
                return_element = '<i class="fas fa-text-height me-4 text-secondary"></i>';
                break;
            }
            case "int-number":
            {
                return_element = '<i class="fas fa-sort-numeric-up me-4 text-secondary"></i>';
                break;
            }
            case "decimal-number":
            {
                return_element = '<i class="fas fa-sort-numeric-up me-4 text-secondary"></i>';
                break;
            }
            case "date":
            {
                return_element = '<i class="fas fa-calendar-alt me-4 text-secondary"></i>';
                break;
            }
            case "time":
            {
                return_element = '<i class="fas fa-clock me-4 text-secondary"></i>';
                break;
            }
            case "file":
            {
                return_element = '<i class="fas fa-file me-4 text-secondary"></i>';
                break;
            }
            case "image":
            {
                return_element = '<i class="fas fa-image me-4 text-secondary"></i>';
                break;
            }
            case "selection":
            {
                return_element = '<i class="fas fa-hand-pointer me-4 text-secondary"></i>';
                break;
            }
            default:
            {
                return_element = '<i class="fas fa-font me-4 text-secondary"></i>';
                break;
            }
        }

        return return_element;
    }
    Text_(identifier, maxlength, required, value)
    {
        return `
            <td scope="row">
                <input class="form-control" type="text" name="${identifier}" maxlength="${maxlength}" 
                ${required == '1' ? 'required' : ''} value="${value}"/>
            </td>
        `;
    }
    LongText_(identifier, maxlength, required, value)
    {
        return `
            <td scope="row">
                <textarea class="form-control" name="${identifier}" maxlength="${maxlength}" 
                ${required == '1' ? 'required' : ''}>${value}</textarea>
            </td>
        `;
    }
    IntNumber_(identifier, maxlength, required, value)
    {
        return `
            <td scope="row">
                <input class="form-control" type="number" name="${identifier}" maxlength="${maxlength}"
                ${required == '1' ? 'required' : ''} value="${value}"/>
            </td>
        `;
    }
    DecimalNumber_(identifier, maxlength, required, value)
    {
        return `
            <td scope="row">
                <input class="form-control" type="number" name="${identifier}" maxlength="${maxlength}" 
                ${required == '1' ? 'required' : ''} value="${value}"/>
            </td>
        `;
    }
    Date_(identifier, required, value)
    {
        if(value != undefined || value != "")
        {
            let date = new Date(value);
            let day = ("0" + date.getDate()).slice(-2);
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let today = date.getFullYear() + "-" + (month) + "-" + (day) ;
            
            value = today;
        }

        return `
            <td scope="row">
                <input class="form-control" type="date" name="${identifier}" 
                ${required == '1' ? 'required' : ''} value="${value}"/>
            </td>
        `;
    }
    Time_(identifier, required, value)
    {
        return `
            <td scope="row">
                <input class="form-control" type="time" name="${identifier}" 
                ${required == '1' ? 'required' : ''} value="${value}"/>
            </td>
        `;
    }
    File_(identifier, required, value)
    {
        return `
            <td scope="row">
                <input class="form-control" type="file" name="${identifier}" 
                ${required == '1' ? 'required' : ''}/>
            </td>
        `;
    }
    Image_(identifier, required, value)
    {
        return `
            <td scope="row">
                <input class="form-control" type="file" name="${identifier}" 
                ${required == '1' ? 'required' : ''}/>
            </td>
        `;
    }
    Selection_(identifier, required)
    {
        return `
            <td scope="row">
                <select class="form-select" name="${identifier}" ${required == '1' ? 'required' : ''}>
                    <option value="">-- Ninguno --</option>
                </select>
            </td>
        `;
    }
}