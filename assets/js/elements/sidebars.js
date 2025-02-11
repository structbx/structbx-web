
class Sidebars
{
    constructor() {}
    SidebarMenu_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <h5 class="small text-uppercase text-muted">ESPACIOS</h5>
            <div id="component_sidebar_spaces">
                <div class="notifications"></div>
                <div class="contents"></div>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
    SidebarMenuAdministration_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <div class="nav-item">
                <a class="nav-link mb-2 go-button" go-path="/start" go-hash="" href="#">
                    <i class="fas fa-arrow-left"></i>
                    <span class="ms-2">Ir a inicio</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_spaces nav-link mb-2" href="#spaces" menu="spaces">
                    <i class="fas fa-building"></i>
                    <span class="ms-2">Espacios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_my_account nav-link mb-2" href="#my_account" menu="my_account">
                    <i class="fas fa-user"></i>
                    <span class="ms-2">Mi cuenta</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_instance nav-link mb-2" href="#instance" menu="instance">
                    <i class="fas fa-home"></i>
                    <span class="ms-2">Instancia</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_users nav-link mb-2" href="#users" menu="users">
                    <i class="fas fa-users"></i>
                    <span class="ms-2">Usuarios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_groups nav-link mb-2" href="#groups" menu="groups">
                    <i class="fas fa-users-cog"></i>
                    <span class="ms-2">Grupos</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_permissions nav-link mb-2" href="#permissions" menu="permissions">
                    <i class="fas fa-user-lock"></i>
                    <span class="ms-2">Permisos</span>
                </a>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
    SidebarMenuSpace_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <div class="nav-item">
                <a class="nav-link mb-2 go-button" go-path="/start" go-hash="" href="#">
                    <i class="fas fa-arrow-left"></i>
                    <span class="ms-2">Ir a inicio</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2 go-button" go-path="/administration" go-hash="#spaces" href="#">
                    <i class="fas fa-arrow-left"></i>
                    <span class="ms-2">Ir a espacios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_space nav-link mb-2" href="#space" menu="space">
                    <i class="fas fa-building"></i>
                    <span class="ms-2">Espacio</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_users nav-link mb-2" href="#users" menu="users">
                    <i class="fas fa-users"></i>
                    <span class="ms-2">Usuarios</span>
                </a>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
    SidebarMenuForm_()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <div class="nav-item">
                <a class="nav-link mb-2 go-button" go-path="/start" go-hash="" href="#">
                    <i class="fas fa-arrow-left"></i>
                    <span class="ms-2">Ir a inicio</span>
                </a>
            </div>
            <h5 class="small text-uppercase text-muted">FORMULARIOS</h5>
            <div id="component_sidebar_forms">
                <div class="notifications"></div>
                <div class="contents"></div>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
    SidebarMenuFormSettings_()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <div class="nav-item">
                <a class="nav-link mb-2 go-button" go-path="/start" go-hash="" href="#">
                    <i class="fas fa-arrow-left"></i>
                    <span class="ms-2">Ir a inicio</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2 go-form-button" href="#">
                    <i class="fas fa-arrow-left"></i>
                    <span class="ms-2">Ir al formulario</span>
                </a>
            </div>
            <h5 class="small text-uppercase text-muted">FORMULARIOS</h5>
            <div id="component_sidebar_forms">
                <div class="notifications"></div>
                <div class="contents"></div>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
}