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
        if(this.response.status >= 200 && this.response.status < 300)
        {
            return true;
        }
        else if(this.response.status == 401)
        {
            this.Warning_().Show_('No tiene permisos para acceder a este recurso.' + this.target);
            return false;
        }
        if(this.response.status >= 500 && this.response.status < 600)
        {
            if(this.response != undefined && this.response.body != undefined && this.response.body.message != undefined)
            {
                const error_message = this.response.body.message;
                this.Error_().Show_('Hubo un error con la comunicaci&oacute;n al servidor' + this.target + ': ' + error_message);
            }
            return false;
        }
        else
        {
            if(this.response != undefined && this.response.body != undefined && this.response.body.message != undefined)
            {
                const error_message = this.response.body.message;
                this.Warning_().Show_('Hubo un error al realizar la operaci&oacute;n' + this.target + ': ' + error_message);
            }
            return false;
        }
    }
    Warning_()
    {
        if(this.component == '')
            return new wtools.Notification('WARNING');
        else
            return new wtools.Notification('WARNING', 0, this.component);
    }
    Error_()
    {
        if(this.component == '')
            return new wtools.Notification('ERROR');
        else
            return new wtools.Notification('ERROR', 0, this.component);
    }
}