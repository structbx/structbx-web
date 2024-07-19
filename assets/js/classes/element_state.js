
class ElementState
{
    constructor(element, active, type, text_to_change)
    {
        this.element = element;
        this.active = active;
        this.type = type;
        this.text_to_change = text_to_change;
        this.text_original = $(element).text();

        if(active) this.On_();
        else this.Off_();
    }
    Change_ = () =>
    {
        if(this.active)
            this.Off_();
        else
            this.On_();
    }
    On_ = () =>
    {
        this.active = true;

        if(this.type == "button")
            $(this.element).attr('disabled', '');
        else if(this.type == "block")
            $(this.element).removeClass('d-none');

        $(this.element).html('');
        $(this.element).append(this.text_to_change);
    }
    Off_ = () =>
    {
        this.active = false;

        if(this.type == "button")
            $(this.element).removeAttr('disabled');
        else if(this.type == "block")
            $(this.element).addClass('d-none');

        $(this.element).html(this.text_original);
    }
};