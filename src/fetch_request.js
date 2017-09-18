import querystring from "querystring";
import Stream from "stream";
import through2 from "through2";
import { btoa } from "./helpers";

require("es6-promise").polyfill();
require("fetch-everywhere");

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
				if ("getReader" in res.body) {
					const reader = res.body.getReader();
					let array = [];

					const readData = () => {
						reader.read().then(data => {
							array.push(...data.value);
							if (isJson(array)) {
								const string = Utf8ArrayToStr(array);
								const value = JSON.parse(string);
								array = [];
								this.resultStream.emit("data", value);
							} else {
								if (data.done) {
									this.resultStream.emit("error", "JSON Parsing error");
								}
							}

							if (data.done) {
								this.resultStream.emit("end");
							} else {
								readData();
							}
						});
					};

					readData();
				} else {
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
				}
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

function isJson(arr) {
	try {
		const str = Utf8ArrayToStr(arr);
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function Utf8ArrayToStr(array) {
	let out;
	let i;
	let len;
	let c;
	let char2;
	let char3;

	out = "";
	len = array.length;
	i = 0;

	while(i < len) {
			c = array[i++];
			switch(c >> 4)
			{ 
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += String.fromCharCode(c);
					break;
				case 12: case 13:
					// 110x xxxx   10xx xxxx
					char2 = array[i++];
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = array[i++];
					char3 = array[i++];
					out += String.fromCharCode(((c & 0x0F) << 12) |
													((char2 & 0x3F) << 6) |
													((char3 & 0x3F) << 0));
					break;
			}
	}

	return out;
}