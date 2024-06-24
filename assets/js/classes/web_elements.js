
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
                <a class="navbar-brand d-flex align-items-center" href="../../es/clients/start/">
                    <div class="container">
                        <img width="40px;" src="../../assets/images/logo-150x150.png" alt="Logo">
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
                                    <li><a class="dropdown-item" href="#!">Configuraci&oacute;n</a></li>
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
                    <i class="fas fa-tachometer-alt"></i>
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
                <a class="menu_pages nav-link mb-2" href="#pages" menu="pages">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">P&aacute;ginas</span>
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
            <h5 class="small text-uppercase text-muted">P&aacute;ginas</h5>
            <div class="nav-item">
                <a class="nav-link mb-2" href="#">
                    <i class="fas fa-file"></i>
                    <span class="ms-2">Indicadores generales</span>
                </a>
            </div>
        `));

        $(".sidebar_menu").append(sidebar_menu);
    }
}