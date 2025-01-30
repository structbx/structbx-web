
class Headers
{
    constructor(){}
    Header_()
    {
        $("#header_main").append
        (`
            <div class="container-fluid d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="../start/">
                    <div class="container">
                        <img width="40px;" src="../assets/images/logo-150x150.png" alt="Logo">
                    </div>
                </a>
                <button class="navbar-toggler d-md-none collapsed btn-ligth text-end" type="button" data-bs-toggle="collapse" data-bs-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars" style="color:#fff;"></i>
                </button>
                <div class="sidebar d-md-flex justify-content-between collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item ms-md-2 mt-2 mt-md-0">
                            <div class="d-flex align-items-center h-100">
                                <h4 id="instance_name" class="m-0"></h4>
                            </div>
                        </li>
                        <div class="vr mx-4"></div>
                        <li class="nav-item dropdown ms-md-2 mt-2 mt-md-0">
                            <a class="nav-link dropdown-toggle btn btn-ligth space_name" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>
                            <ul id="space_all_spaces" class="dropdown-menu" aria-labelledby="space_name">
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
                                    <li><a class="dropdown-item go-settings-button" href="#">Configuraci&oacute;n</a></li>
                                    <li><a id="logout-button" class="dropdown-item" href="#">Cerrar sesi&oacute;n</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `);    
    }

    HeaderSpace_ ()
    {
        $("#header_main").append
        (`
            <div class="container-fluid d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="../start/">
                    <div class="container">
                        <img width="40px;" src="../assets/images/logo-150x150.png" alt="Logo">
                    </div>
                </a>
                <button class="navbar-toggler d-md-none collapsed btn-ligth text-end" type="button" data-bs-toggle="collapse" data-bs-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars" style="color:#fff;"></i>
                </button>
                <div class="sidebar d-md-flex justify-content-between collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item ms-md-2 mt-2 mt-md-0">
                            <div class="d-flex align-items-center h-100">
                                <h4 id="instance_name" class="m-0"></h4>
                            </div>
                        </li>
                        <div class="vr mx-4"></div>
                        <li class="nav-item ms-md-2 mt-2 mt-md-0">
                            <a class="nav-link btn btn-ligth" aria-current="page" href="../start/">
                                <i class="fas fa-chevron-left me-2"></i>
                                <span class="space_name"></span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="sidebar collapse navbar-collapse">
                    <div class="d-flex flex-row-reverse ms-auto">
                        <ul class="navbar-nav ms-md-0 me-3 me-lg-4">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item go-settings-button" href="#">Configuraci&oacute;n</a></li>
                                    <li><a id="logout-button" class="dropdown-item" href="#">Cerrar sesi&oacute;n</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `);
    }
    HeaderForm_(target = "")
    {
        let buttons = ``;

        if(target == "columns" || target == "settings")
        {
            buttons = `
                <li class="nav-item ms-md-2 mt-2 mt-md-0">
                    <a class="nav-link btn btn-ligth go_form">
                        <i class="fas fa-chevron-left me-2"></i>
                        <span id="form_name"></span>
                    </a>
                </li>
            `;
        }

        $("#header_main").append
        (`
            <div class="container-fluid d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="../start/">
                    <div class="container">
                        <img width="40px;" src="../assets/images/logo-150x150.png" alt="Logo">
                    </div>
                </a>
                <button class="navbar-toggler d-md-none collapsed btn-ligth text-end" type="button" data-bs-toggle="collapse" data-bs-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars" style="color:#fff;"></i>
                </button>
                <div class="sidebar d-md-flex justify-content-between collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item ms-md-2 mt-2 mt-md-0">
                            <div class="d-flex align-items-center h-100">
                                <h4 id="instance_name" class="m-0"></h4>
                            </div>
                        </li>
                        <div class="vr mx-4"></div>
                        <li class="nav-item ms-md-2 mt-2 mt-md-0">
                            <a class="nav-link btn btn-ligth" aria-current="page" href="../start/">
                                <i class="fas fa-chevron-left me-2"></i>
                                <span class="space_name"></span>
                            </a>
                        </li>
                        ` + buttons + `
                    </ul>
                </div>
                <div class="sidebar collapse navbar-collapse">
                    <div class="d-flex flex-row-reverse ms-auto">
                        <ul class="navbar-nav ms-md-0 me-3 me-lg-4">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item go-settings-button" href="#">Configuraci&oacute;n</a></li>
                                    <li><a id="logout-button" class="dropdown-item" href="#">Cerrar sesi&oacute;n</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `);
    }
}