
class WebElements
{
    constructor()
    {
        
    }
    Footer_()
    {
        let year = new Date().getFullYear();
        $(".main_footer").append
        (`
            <div class="py-3 my-4">
                <div class="d-flex align-items-center justify-content-between small">
                    <div class="text-muted">Copyright &copy; ${year} StructBI.</div>
                    <div>
                        <a href="#">Pol&iacute;tica de privacidad</a>
                        &middot;
                        <a href="#">T&eacute;rminos y condiciones</a>
                    </div>
                </div>
            </div>
        `);
    }
    Header_()
    {
        $(".main_header").append
        (`
            <div class="container-fluid d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="../start/">
                    <div class="container">
                        <img width="40px;" src="../assets/images/logo-150x150.png" alt="Logo">
                    </div>
                    <strong class="container ml-2 d-none d-md-block">StructBI</strong>
                </a>
                <button class="navbar-toggler d-md-none collapsed btn text-end" type="button" data-bs-toggle="collapse" data-bs-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="sidebar collapse navbar-collapse">
                    <div class="d-flex flex-row-reverse ms-auto">
                        <ul class="navbar-nav ms-md-0 me-3 me-lg-4">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="../start/#settings">Configuraci&oacute;n</a></li>
                                    <li><a class="dropdown-item" href="#!">Cerrar sesi&oacute;n</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `);    
    }
    HeaderForm_ = () =>
    {
        $(".main_header").append
        (`
            <div class="container-fluid d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="../start/">
                    <div class="container">
                        <img width="40px;" src="../assets/images/logo-150x150.png" alt="Logo">
                    </div>
                    <strong class="container ml-2 d-none d-md-block">StructBI</strong>
                </a>
                <button class="navbar-toggler d-md-none collapsed btn text-end" type="button" data-bs-toggle="collapse" data-bs-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="sidebar d-md-flex justify-content-between collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link btn btn-ligth" aria-current="page" href="../start/">
                                <i class="fas fa-chevron-left me-2"></i>
                                Inicio
                            </a>
                        </li>
                        <li class="nav-item dropdown ms-md-2 mt-2 mt-md-0">
                            <a class="nav-link dropdown-toggle btn btn-ligth" href="#" id="form_selection" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Form 1
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="form_selection">
                                <li><a class="dropdown-item" href="#">Form 1</a></li>
                                <li><a class="dropdown-item" href="#">Form 2</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="sidebar collapse navbar-collapse">
                    <div class="d-flex flex-row-reverse ms-auto">
                        <ul class="navbar-nav ms-md-0 me-3 me-lg-4">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="../start/#settings">Configuraci&oacute;n</a></li>
                                    <li><a class="dropdown-item" href="#!">Cerrar sesi&oacute;n</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `);
    }
    SidebarMenu_ = () =>
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <h5 class="small text-uppercase text-muted">GENERAL</h5>
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
            <h5 class="small text-uppercase text-muted">Dashboards</h5>
            <div class="nav-item">
                <a class="nav-link mb-2" href="#">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Indicadores generales</span>
                </a>
            </div>
        `));

        $(".sidebar_menu").append(sidebar_menu);
    }
    SidebarMenuDashboard_ = () =>
    {
        let sidebar_menu = $('<nav class="nav nav-pills flex-column justify-contents-between pt-4"></nav>');
        sidebar_menu.append($(`
            <h5 class="small text-uppercase text-muted">GENERAL</h5>
            <div class="nav-item">
                <a class="nav-link mb-2" href="../start/#start">
                    <i class="fas fa-home"></i>
                    <span class="ms-2">Inicio</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="../start/#forms">
                    <i class="fas fa-table"></i>
                    <span class="ms-2">Formularios</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="../start/#dashboards">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="ms-2">Dashboards</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="../start/#reports" menu="reports">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Reportes</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="../start/#organization">
                    <i class="fas fa-building"></i>
                    <span class="ms-2">Organizaci&oacute;n</span>
                </a>
            </div>
            <div class="nav-item">
                <a class="nav-link mb-2" href="../start/#settings">
                    <i class="fas fa-cog"></i>
                    <span class="ms-2">Configuraci&oacute;n</span>
                </a>
            </div>
            <h5 class="small text-uppercase text-muted">Dashboards</h5>
            <div class="nav-item">
                <a class="nav-link active mb-2" href="#">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Indicadores generales</span>
                </a>
            </div>
        `));

        $(".sidebar_menu").append(sidebar_menu);
    }
    SidebarMenuForm_ = () =>
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
                <a class="menu_form_design nav-link mb-2" href="#form_design" menu="form_design">
                    <i class="fas fa-table"></i>
                    <span class="ms-2">Diseño de formulario</span>
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