
class ServerConfig
{
    constructor()
    {
        this.url_production = "https://pedidosturpial.com";
        this.url_development = "https://localhost:3000";
        this.api_url = `${this.url_production}/api`;
        this.host_url = this.url_production;

        switch (window.location.hostname)
        {
            case "pedidosturpial.com":
                this.api_url = `${this.url_production}/api`;
                this.host_url = this.url_production;
            break;
            case "localhost":
                this.api_url = `${this.url_development}/api`;
                this.host_url = this.url_development;
            break;
            case "127.0.0.1":
                this.api_url = `${this.url_development}/api`;
                this.host_url = this.url_development;
            break;
        }
    }
}
