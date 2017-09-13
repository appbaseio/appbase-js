import querystring from "querystring";

export default class fetchReuest {
	constructor(client, args) {
		this.client = client;
        this.args = args;

        this.method = args.method;
        this.path = args.path;
        this.params = args.params;
        this.body = args.body;
        
        if(!this.body || !(typeof this.body === "object" || this.body.constructor === Array) ) {
            this.body = {};
        }
        
        if(this.body.constructor === Array) {
            const arrayBody = this.body;
            this.body = "";
            for(let i=0; i < arrayBody.length; i++) {
                this.body += JSON.stringify(arrayBody[i]);
                this.body += "\n";
            }
        }

		return fetch(`${this.client.protocol}//${this.client.url}/${this.client.appname}/${this.path}?${querystring.stringify(this.params)}`, {
			method: this.method,
			headers: {
				"Authorization": `Basic ${btoa(this.client.credentials)}`,
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: this.body
		})
		.then(res => res.json());
	}
}