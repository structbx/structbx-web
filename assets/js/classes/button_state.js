
class ButtonState
{
    constructor(button, active, text_to_change)
    {
        this.button = button;
        this.active = active;
        this.text_to_change = text_to_change;
        this.text_original = $(button).text();
    }
    Change_ = () =>
    {
        if(this.active)
        {
            this.active = false;
            this.Wait_();
        }
        else
        {
            this.active = true;
            this.Stop_();
        }
    }
    Wait_ = () =>
    {
        $(this.button).attr('disabled', '');
        $(this.button).html('');
        $(this.button).append(this.text_to_change);
    }
    Stop_ = () =>
    {
        $(this.button).removeAttr('disabled');
        $(this.button).html(this.text_original);
    }
};