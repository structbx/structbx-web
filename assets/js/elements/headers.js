
class Headers
{
    constructor(){}
    Header_()
    {
        $("#header_main").append
        (`
            <div class="container-xxl d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="../start/">
                    <div class="container">
                        <img width="40px;" src="../assets/images/logo-150x150.png" alt="Logo">
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
                                    <span class="me-1">Espacio:</span>
                                    <span class="space_name"></span>
                                </div>
                            </li>
                            <div class="vr mx-4 d-none d-md-inline-block"></div>
                            <li class="nav-item me-2">
                                <div class="d-flex align-items-center h-100 text-center">
                                    <span class="me-1">Bienvenido:</span>
                                    <span class="username_logued"></span>
                                </div>
                            </li>
                            <div class="vr mx-4 d-none d-md-inline-block"></div>
                            <li class="nav-item dropdown me-2">
                                <a class="nav-link dropdown-toggle" id="dropdown_administration" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-tools fa-fw"></i>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown_administration">
                                    <li><a class="dropdown-item go-spaces-button" href="#">Espacios</a></li>
                                    <li><a class="dropdown-item go-my-account-button" href="#">Mi cuenta</a></li>
                                    <li><a class="dropdown-item go-instance-button" href="#">Instancia</a></li>
                                    <li><a class="dropdown-item go-users-button" href="#">Usuarios</a></li>
                                    <li><a class="dropdown-item go-groups-button" href="#">Grupos</a></li>
                                    <li><a class="dropdown-item go-permissions-button" href="#">Permisos</a></li>
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