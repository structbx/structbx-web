
class Sidebars
{
    constructor() {}
    SidebarMenu_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <div class="nav-item">
                <a class="menu_start nav-link mb-2 active" href="#start" menu="start">
                    <i class="fas fa-home"></i>
                    <span class="ms-2">Inicio</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_forms nav-link mb-2" href="#forms" menu="forms">
                    <i class="fas fa-table"></i>
                    <span class="ms-2">Formularios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_dashboards nav-link mb-2" href="#dashboards" menu="dashboards">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="ms-2">Dashboards</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_reports nav-link mb-2" href="#reports" menu="reports">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Reportes</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_organization nav-link mb-2" href="#organization" menu="organization">
                    <i class="fas fa-building"></i>
                    <span class="ms-2">Organizaci&oacute;n</span>
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
    SidebarMenuDashboard_ ()
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <h5 class="small text-uppercase text-muted">DASHBOARDS</h5>
            <div class="nav-item">
                <a class="nav-link active mb-2" href="/dashboard?id=1">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="ms-2">Indicadores Generales</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="/dashboard?id=2">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="ms-2">Indicadores detallados</span>
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
                <a class="menu_general nav-link mb-2 active" href="#general" menu="general">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="ms-2">General</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_columns nav-link mb-2 active" href="#columns" menu="columns">
                    <i class="fas fa-columns"></i>
                    <span class="ms-2">Columnas</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_data nav-link mb-2 active" href="#data" menu="data">
                    <i class="fas fa-database"></i>
                    <span class="ms-2">Data</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="menu_form_design nav-link mb-2" href="#form_design" menu="form_design">
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