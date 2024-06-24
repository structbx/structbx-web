$.fn.isValid = function()
{
    return this[0].checkValidity()
}

class FormChecker
{
    constructor(form)
    {
        this.form = form;
        this.validity = true;
    }
    Check_ = () =>
    {
        if (!$(this.form).isValid())
        {
            this.validity = false;
        }
    
        $(this.form).addClass('was-validated')
    
        return this.validity;
    }
}