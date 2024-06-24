class NotificationType
{
    constructor()
    {
        this.SUCCESS = "SUCCESS";
        this.WARNING = "WARNING";
        this.ERROR = "ERROR";
    }
}

class Notification
{
    constructor(notification_type, time = 5000, element = '#notifications')
    {
        this.notification_type = notification_type;
        this.time = time;
        this.element = element;
        this.notification = '';
    }
    Show_ = (message) =>
    {
        let type = new NotificationType;
        switch(this.notification_type)
        {
            case type.SUCCESS:
                this.notification = $(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                break;
            case type.WARNING:
                this.notification = $(`
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                break;
            case type.ERROR:
                this.notification = $(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
                break;
        }
        $(this.element).append(this.notification);
        this.Timeout_();
    }
    Timeout_()
    {
        if(this.time > 0)
            setTimeout(this.Close_, this.time, this.notification);
    }
    Close_(notification)
    {
        if(notification)
            $(notification).remove();
    }
}