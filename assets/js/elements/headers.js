
class Headers
{
    constructor(){}
    Header_()
    {
        $("#header_main").append
        (`
            <div class="container-xxl d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center m-0" href="../start/">
                    <div class="container">
                        <img width="40px;" src="/api/general/instanceLogo/read" alt="Logo">
                    </div>
                </a>
                <button class="navbar-toggler d-md-none collapsed btn-ligth text-end" type="button" data-bs-toggle="collapse" data-bs-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars" style="color:#fff;"></i>
                </button>
                <div class="sidebar d-md-flex justify-content-between collapse navbar-collapse text-center text-md-left">
                    <ul class="navbar-nav">
                        <li class="nav-item ms-md-2 mt-2 mt-md-0">
                            <div class="d-flex align-items-center h-100">
                                <h4 id="instance_name" class="m-0"></h4>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="sidebar d-md-flex collapse navbar-collapse text-center text-md-left">
                    <ul class="navbar-nav ms-md-auto me-3 me-lg-4">
                        <li class="nav-item me-2">
                            <div class="d-flex align-items-center h-100 text-center">
                                <a class="btn btn-outline-secondary py-2 px-4 go-button" go-path="/administration" go-hash="#spaces" href="#">
                                    <span class="me-2"><i class="fas fa-building"></i></span>
                                    <span class="space_name"></span>
                                </a>
                            </div>
                        </li>
                        <div class="vr mx-4 d-none d-md-inline-block"></div>
                        <li class="nav-item me-2">
                            <div class="d-flex align-items-center h-100 text-center">
                                <a class="btn btn-outline-secondary py-2 px-4 go-button" go-path="/administration" go-hash="#my_account" href="#">
                                    <span class="me-2"><i class="fas fa-user"></i></span>
                                    <span class="username_logued"></span>
                                </a>
                            </div>
                        </li>
                        <div class="vr mx-4 d-none d-md-inline-block"></div>
                        <li class="nav-item me-2">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                <i class="fas fa-tools fa-fw"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-2 bg-dark" style="z-index:1050;">
                                <li>
                                    <a class="dropdown-item btn btn-ligth py-2 px-4 go-button" go-path="/administration" go-hash="#spaces" href="#">
                                        <i class="fas fa-building"></i>
                                        <span class="ms-2">Espacios</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item btn btn-ligth py-2 px-4 go-button" go-path="/administration" go-hash="#my_account"href="#">
                                        <i class="fas fa-user"></i>
                                        <span class="ms-2">Mi cuenta</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item btn btn-ligth py-2 px-4 go-button" go-path="/administration" go-hash="#instance" href="#">
                                        <i class="fas fa-home"></i>
                                        <span class="ms-2">Instancia</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item btn btn-ligth py-2 px-4 go-button" go-path="/administration" go-hash="#users" href="#">
                                        <i class="fas fa-users"></i>
                                        <span class="ms-2">Usuarios</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item btn btn-ligth py-2 px-4 go-button" go-path="/administration" go-hash="#groups" href="#">
                                        <i class="fas fa-cog"></i>
                                        <span class="ms-2">Grupos</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item btn btn-ligth py-2 px-4 go-button" go-path="/administration" go-hash="#permissions" href="#">
                                        <i class="fas fa-user-lock"></i>
                                        <span class="ms-2">Permisos</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item me-2">
                            <a class="nav-link" href="#" id="logout-button">
                                <i class="fas fa-sign-out-alt"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `);    
    }
}