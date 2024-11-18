
class Sidebars
{
    constructor() {}
    SidebarMenu_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <div class="nav-item">
                <a class="menu_forms nav-link mb-2" href="#forms" menu="forms">
                    <i class="fas fa-table"></i>
                    <span class="ms-2">Formularios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_spaces nav-link mb-2" href="#spaces" menu="spaces">
                    <i class="fas fa-building"></i>
                    <span class="ms-2">Espacios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="#my_account" menu="my_account">
                    <i class="fas fa-cog"></i>
                    <span class="ms-2">Administraci&oacute;n</span>
                </a>
            </div>
            <div class="nav-item ps-4">
                <div class="ps-2 mb-2"  style="border-left: 1px solid #DDD;">
                    <a class="menu_my_account nav-link mb-2" href="#my_account" menu="my_account">
                        <span>Mi cuenta</span>
                    </a>
                    <a class="menu_organization nav-link mb-2" href="#organization" menu="organization">
                        <span>Organizaci&oacute;n</span>
                    </a>
                    <a class="menu_users nav-link mb-2" href="#users" menu="users">
                        <span>Usuarios</span>
                    </a>
                    <!--<a class="menu_groups nav-link mb-2" href="#groups" menu="groups">
                        <span>Grupos</span>
                    </a>
                    <a class="menu_permissions nav-link mb-2" href="#permissions" menu="permissions">
                        <span>Permisos</span>
                    </a>-->
                </div>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
    SidebarMenuSpace_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
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
            <h5 class="small text-uppercase text-muted">GENERAL</h5>
            <div class="nav-item">
                <a class="menu_data nav-link mb-2 active" href="#data" menu="data">
                    <i class="fas fa-database"></i>
                    <span class="ms-2">Data</span>
                </a>
            </div>
            <div class="nav-item ps-4">
                <div class="ps-2 mb-2"  style="border-left: 1px solid #DDD;">
                    <a class="nav-link data_filter mb-2" href="#data" menu="data">
                        <span>Buscar</span>
                    </a>
                    <a class="nav-link data_import mb-2" href="#data" menu="data">
                        <span>Importar</span>
                    </a>
                    <a class="nav-link data_order mb-2" href="#data" menu="data">
                        <span>Exportar</span>
                    </a>
                </div>
            </div>
            <div class="nav-item">
                <a class="menu_columns nav-link mb-2 active" href="#columns" menu="columns">
                    <i class="fas fa-columns"></i>
                    <span class="ms-2">Columnas</span>
                </a>
            </div>
            <h5 class="small text-uppercase text-muted">EXTRA</h5>
            <div class="nav-item">
                <a class="menu_settings nav-link mb-2" href="#settings" menu="settings">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Configuraci&oacute;n</span>
                </a>
            </div>
        `));

        $("#menu_main").append(sidebar_menu);
    }
}