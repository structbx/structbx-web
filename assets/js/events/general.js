
$(function ()
{
    instance_name_read();
        
    databases_read_id();
    
    username_logued_read();

    $(document).on('click', '#logout-button', (e) =>
    {
        e.preventDefault();

        logout();
    });
    
    $(document).on('click', '.go-button', function(e)
    {
        e.preventDefault();
        let path = $(e.currentTarget).attr('go-path');
        let hash = $(e.currentTarget).attr('go-hash');
        if(window.location.pathname == path || window.location.pathname == path + "/")
        {
            location.hash = hash;
            location.reload();
        }
        else
        {
            new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
            window.location.href = path + hash;
        }
    });

    $(document).on('click', '.go-form-button', function(e)
    {
        e.preventDefault();
        new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);
        window.location.href = `/table?identifier=${wtools.GetUrlSearchParam('identifier')}`;
    });
});
