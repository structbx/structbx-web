class Request
{
	constructor(endpoint = '', method = 'GET', data = {}, stringify = true)
	{
		this.endpoint = endpoint;
		this.method = method;
		this.data = data;
		this.stringify = stringify;
		this.url = "https://localhost:3000/";
	}

	async MakeHTTPRequest()
	{
		switch(this.method)
		{
			case "GET":
				return this.GETRequest();
				break;
			case "POST":
				return this.POSTRequest();
				break;
			case "PUT":
				return this.PUTRequest();
				break;
			case "DEL":
				return this.DELRequest();
				break;
			default:
				return this.GETRequest();
				break;
		}
	}

	async GETRequest()
	{
		const response = await fetch(`${this.url}${this.endpoint}?json=${JSON.stringify(this.data)}`
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

	async POSTRequest()
	{
		const response = await fetch(`${this.url}${this.endpoint}`
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

	async PUTRequest()
	{
		const response = await fetch(`${this.url}${this.endpoint}`
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

	async DELRequest()
	{
		const response = await fetch(`${this.url}${this.endpoint}`
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
