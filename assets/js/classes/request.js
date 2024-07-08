
class ResponseData
{
    constructor(error, status, body)
    {
        this.error = error;
        this.status = status;
        this.body = body;
    }
}

class Request
{
	constructor(endpoint = '', method = 'GET', data = {}, stringify = true)
	{
		this.endpoint = endpoint;
		this.method = method;
		this.data = data;
		this.stringify = stringify;
	}

	async MakeHTTPRequest()
	{
		let result;
		switch(this.method)
		{
			case "GET":
				result = this.GETRequest_();
				break;
			case "POST":
				result = this.POSTRequest_();
				break;
			case "PUT":
				result = this.PUTRequest_();
				break;
			case "DEL":
				result = this.DELRequest_();
				break;
			default:
				result = this.GETRequest_();
				break;
		}
		return result;
	}

	Exec_(callback)
	{
        let response_data = new ResponseData(false, "", []);
        this.MakeHTTPRequest()
        .then((response) =>
        {
            response_data.status = response.status;
            return response.json();
        })
        .then((body) => 
        {
            response_data.body = body;
            callback(response_data);
        })
        .catch(error =>
        {
            response_data.error = true;
            response_data.body = error;
            callback(response_data);
        });
	}

	async GETRequest_()
	{
		const response = await fetch(`${this.endpoint}?json=${JSON.stringify(this.data)}`
		,{
			method: 'GET'
			,mode: 'cors'
			,cache: 'no-cache'
			,credentials: 'same-origin'
			,redirect: 'follow'
			,referrerPolicy: 'no-referrer'
		});
		return response;
	}

	async POSTRequest_()
	{
		const response = await fetch(`${this.endpoint}`
		,{
			method: 'POST'
			,mode: 'cors'
			,cache: 'no-cache'
			,credentials: 'same-origin'
			,redirect: 'follow'
			,referrerPolicy: 'no-referrer'
			,headers: (this.stringify ? {'Content-Type': 'application/json'} : {})
			,body: (this.stringify ? JSON.stringify(this.data) : this.data)
		});
		return response;
	}

	async PUTRequest_()
	{
		const response = await fetch(`${this.endpoint}`
		,{
			method: 'PUT'
			,mode: 'cors'
			,cache: 'no-cache'
			,credentials: 'same-origin'
			,redirect: 'follow'
			,referrerPolicy: 'no-referrer'
			,headers: (this.stringify ? {'Content-Type': 'application/json'} : {})
			,body: (this.stringify ? JSON.stringify(this.data) : this.data)
		});
		return response;
	}

	async DELRequest_()
	{
		const response = await fetch(`${this.endpoint}`
		,{
			method: 'DEL'
			,mode: 'cors'
			,cache: 'no-cache'
			,credentials: 'same-origin'
			,redirect: 'follow'
			,referrerPolicy: 'no-referrer'
			,headers: (this.stringify ? {'Content-Type': 'application/json'} : {})
			,body: (this.stringify ? JSON.stringify(this.data) : this.data)
		});
		return response;
	}
}
