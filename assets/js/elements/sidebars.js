
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
                    <span class="ms-2">Espacio</span>
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
            <div class="nav-item">
                <a class="menu_columns nav-link mb-2 active" href="#columns" menu="columns">
                    <i class="fas fa-columns"></i>
                    <span class="ms-2">Columnas</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_interface_design nav-link mb-2" href="#interface_design" menu="interface_design">
                    <i class="fas fa-table"></i>
                    <span class="ms-2">Diseño</span>
                </a>
            </div>
            <h5 class="small text-uppercase text-muted">EXTRA</h5>
            <div class="nav-item">
                <a class="menu_history nav-link mb-2" href="#history" menu="history">
                    <i class="fas fa-history"></i>
                    <span class="ms-2">Historial</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_bin nav-link mb-2" href="#bin" menu="bin">
                    <i class="fas fa-trash"></i>
                    <span class="ms-2">Papelera</span>
                </a>
            </div>
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