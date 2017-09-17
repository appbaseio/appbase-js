import querystring from "querystring";
import Stream from "stream";
import through2 from "through2";
import { btoa } from "./helpers";

const fetch = require("node-fetch");
const JSONStream = require("json-stream");

export default class fetchRequest {
	constructor(client, args) {
		this.client = client;
		this.args = args;

		this.method = args.method;
		this.path = args.path;
		this.params = args.params;
		this.body = args.body;
		
		if (Array.isArray(this.body)) {
			let arrayBody = "";

            this.body.map(item => {
            	arrayBody += JSON.stringify(item);
            	arrayBody += "\n";
            });

            this.body = arrayBody;
		} else {
			this.body = JSON.stringify(this.body) || {};
		}

		this.resultStream = new Stream();

		fetch(`${this.client.protocol}//${this.client.url}/${this.client.appname}/${this.path}?${querystring.stringify(this.params)}`, {
			method: this.method,
			headers: {
				"Authorization": `Basic ${btoa(this.client.credentials)}`,
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: this.body
		})
			.then(res => {
				this.requestStream = res.body.pipe(JSONStream()).pipe(through2.obj())
				
				this.requestStream.on("data", data => {
					this.resultStream.emit("data", data);
				});
				
				this.requestStream.on ("end", () => {
					this.requestStream.destroy();
					this.resultStream.emit("end");
				});
				
				this.requestStream.on("error", (e) => {
					this.resultStream.emit("error", e);
				});
			})

		this.resultStream.on("data", res => {
			this.response = res;
		});

		this.resultStream.stop = this.stop.bind(this);
		this.resultStream.reconnect = this.reconnect.bind(this);

		return this.resultStream;
	}

	getId(callback) {
		if(this.response) {
			callback(this.response.headers["query-id"]);
		} else {
			this.resultStream.on("data", res => {
				callback(res.headers["query-id"]);
			})
		}
	}

	stop() {
		if (this.requestStream) {
			this.requestStream.destroy();
		}
	}

	reconnect() {
		this.stop();
		return new fetchRequest(this.client, this.args);
	}
}
