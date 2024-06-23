
$(function()
{

    // Toggle the side navigation
        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (sidebarToggle)
        {
            if (localStorage.getItem('cpws-sidebar-toggle') === 'true')
                document.body.classList.toggle('cpws-sidenav-toggled');

            sidebarToggle.addEventListener('click', event => {
                event.preventDefault();
                document.body.classList.toggle('cpws-sidenav-toggled');
                localStorage.setItem('cpws-sidebar-toggle', document.body.classList.contains('cpws-sidenav-toggled'));
            });
        }

    // Menus on sidebar nav

        $("#sidebar_nav a").click(function(e)
        {
            $(".contents_body_page").css("display", "none");
            for(let a of $("#sidebar_nav a"))
                a.classList.remove("active");

            let tag = $(e.target).attr('tag');
            $("#" + tag).css("display", "block");
            e.target.classList.add("active");
        });

        if($("#sidebar_nav a").length > 0)
            $("#sidebar_nav a")[0].click();

});
