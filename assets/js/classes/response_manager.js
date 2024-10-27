class ResponseManager
{
    constructor(response, component, target)
    {
        this.response = response;
        this.component = component;
        if(target == '')
            this.target = '';
        else
            this.target = ' (' + target + ')';
    }
    Verify_()
    {
        if(response_data.status >= 200 && response_data.status < 300)
        {
            return true;
        }
        else if(response_data.status == 401)
        {
            this.Warning_().Show_('No tiene permisos para acceder a este recurso.' + this.target);
            return false;
        }
        if(response_data.status >= 500 && response_data.status < 600)
        {
            if(response_data != undefined && response_data.body != undefined && response_data.body.message != undefined)
            {
                const error_message = response_data.body.message;
                this.Error_().Show_('Hubo un error con la comunicaci&oacute;n al servidor' + this.target + ': ' + error_message);
            }
            return false;
        }
        else
        {
            if(response_data != undefined && response_data.body != undefined && response_data.body.message != undefined)
            {
                const error_message = response_data.body.message;
                Warning_().Show_('Hubo un error al realizar la operaci&oacute;n' + this.target + ': ' + error_message);
            }
            return false;
        }
    }
    Warning_()
    {
        if(this.component == '')
            return wtools.Notification('WARNING');
        else
        return wtools.Notification('WARNING', 0, this.component);
    }
    Error_()
    {
        if(this.component == '')
            return wtools.Notification('ERROR');
        else
        return wtools.Notification('ERROR', 0, this.component);
    }
}