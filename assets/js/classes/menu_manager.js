
class MenuManager
{
    constructor(menu)
    {
        this.menu = menu;
        this.menus = [];
        this.current_menu = $("");
        this.current_section = $("");
        this.current_href = "";
        this.section = $("");

        this.AddEvent_();
        this.AddMenus_();
    }
    AddMenus_()
    {
        for(let menu of $(this.menu + " a"))
        {
            let menu_target = $(menu).attr('menu');
            this.menus.push(menu_target);
        }

        if(window.location.hash != "")
        {
            let menu = window.location.hash.replace('#', '');
            if(this.menus.includes(menu))
                this.ManageMenus_(menu);
            else if(this.menus.length > 0)
                this.ManageMenus_(this.menus[0])
        }
        else if(this.menus.length > 0)
            this.ManageMenus_(this.menus[0])
    }
    ManageMenus_(menu_target)
    {
        if(menu_target == undefined)
            return;

        for(let element_menu of this.menus)
        {
            if(element_menu == menu_target)
            {
                this.current_menu = $(this.menu + " .menu_" + element_menu);
                this.current_section = $(".section_" + element_menu);
                let current_href = $(this.menu + " .menu_" + element_menu).attr('href');

                $(this.current_menu).addClass('active');
                $(this.current_section).removeClass('d-none');
                window.location.hash = current_href;
            }
            else
            {
                $(this.menu + " .menu_" + element_menu).removeClass('active');
                $(".section_" + element_menu).addClass('d-none');
            }
        }
    }
    AddEvent_()
    {
        let current_object = this;
        $(this.menu + " a").on("click", function(e)
        {
            e.preventDefault();
            let menu_target = $(e.currentTarget).attr('menu');
            current_object.ManageMenus_(menu_target);
        });
    }
};