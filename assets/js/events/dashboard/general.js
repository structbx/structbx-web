
$(function ()
{
    // Verify Session
    /*let verify_session = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Request
        new wtools.Request(server_config.current.api + "/system/login", "POST").Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                window.location.href = "../login/";
                return;
            }

            wait.Off_();
        });
    };
    verify_session();*/

    // Elements
        new Sidebars().SidebarMenuDashboard_();
        new Headers().HeaderDashboard_();
        new Footers().Footer_();
        //new wtools.MenuManager('.sidebar_menu', true);
        new wtools.MenuManager('.nav_dashboard');
        
    // Chart
        const createChart = () =>
        {
            const ctx = document.getElementById('dashboard_report1_graph');

            new Chart(ctx, 
            {
                type: 'bar'
                ,data: {
                    labels: ['Enero', 'Febrero', 'Marzo']
                    ,datasets: 
                    [
                        {
                            label: 'Ventas'
                            ,data: [12, 19, 3, 5, 2, 3]
                            ,borderWidth: 1
                        }
                        ,{
                            label: 'Ventas por completar'
                            ,data: [2, 4, 2, 2, 1, 2]
                            ,borderWidth: 1
                        }
                        ,{
                            label: 'Ventas fallidas'
                            ,data: [1, 2, 2, 5, 2, 3]
                            ,borderWidth: 1
                        }
                        ,{
                            label: 'Clientes interesados'
                            ,data: [34, 45, 23, 12, 34, 12]
                            ,borderWidth: 1
                        }
                    ]
                }
                ,options:
                {
                    scales: {y: {beginAtZero: true}}
                }
            });
        };
        createChart();
});