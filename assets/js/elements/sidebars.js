
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
            <div class="nav-item ps-4">
                <div class="ps-2 mb-2"  style="border-left: 1px solid #DDD;">
                    <a class="nav-link form_add" href="#forms" menu="forms">
                        <span>Nuevo formulario</span>
                    </a>
                </div>
            </div>
            <div class="nav-item">
                <a class="menu_spaces nav-link mb-2" href="#spaces" menu="spaces">
                    <i class="fas fa-building"></i>
                    <span class="ms-2">Espacios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_settings nav-link mb-2" href="#settings" menu="settings">
                    <i class="fas fa-cog"></i>
                    <span class="ms-2">Configuraci&oacute;n</span>
                </a>
            </div>
        `));

        $(".sidebar_menu").append(sidebar_menu);
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
            <div class="nav-item">
                <a class="menu_groups nav-link mb-2" href="#groups" menu="groups">
                    <i class="fas fa-layer-group"></i>
                    <span class="ms-2">Grupos</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_permissions nav-link mb-2" href="#permissions" menu="permissions">
                    <i class="fas fa-sliders-h"></i>
                    <span class="ms-2">Permisos</span>
                </a>
            </div>
        `));

        $(".sidebar_menu").append(sidebar_menu);
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
                    <a class="nav-link data_add" href="#data" menu="data">
                        <span>Nuevo</span>
                    </a>
                    <a class="nav-link data_filter" href="#data" menu="data">
                        <span>Filtrar</span>
                    </a>
                    <!--<a class="nav-link data_import" href="#data" menu="data">
                        <span>Importar</span>
                    </a>
                    <a class="nav-link data_order" href="#data" menu="data">
                        <span>Ordenar</span>
                    </a>
                    <a class="nav-link data_order" href="#data" menu="data">
                        <span>Exportar</span>
                    </a>-->
                </div>
            </div>
            <div class="nav-item">
                <a class="menu_columns nav-link mb-2 active" href="#columns" menu="columns">
                    <i class="fas fa-columns"></i>
                    <span class="ms-2">Columnas</span>
                </a>
            </div>
            <div class="nav-item ps-4">
                <div class="ps-2 mb-2"  style="border-left: 1px solid #DDD;">
                    <a class="nav-link column_add" href="#columns" menu="columns">
                        <span>Nuevo</span>
                    </a>
                </div>
            </div>
            <h5 class="small text-uppercase text-muted">EXTRA</h5>
            <div class="nav-item">
                <a class="menu_settings nav-link mb-2" href="#settings" menu="settings">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Configuraci&oacute;n</span>
                </a>
            </div>
        `));

        $(".sidebar_menu").append(sidebar_menu);
    }
}