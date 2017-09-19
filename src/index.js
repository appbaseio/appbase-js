import "babel-polyfill";

import URL from "url";
import fetchRequest from "./fetch_request.js"
import betterWs from "./better_websocket.js";
import wsRequest from "./websocket_request.js";
import indexService from "./actions/index.js";
import getService from "./actions/get.js";
import updateService from "./actions/update.js";
import deleteService from "./actions/delete.js";
import bulkService from "./actions/bulk.js";
import searchService from "./actions/search.js";
import getTypesService from "./actions/get_types.js";
import getMappingsService from "./actions/get_mappings.js";
import addWebhookService from "./actions/webhook.js";
import streamDocumentService from "./actions/stream_document.js";
import streamSearchService from "./actions/stream_search.js";

let client = null;

class AppbaseClient {
	constructor(args) {
		if(!client){
			client = this;
		}

		if (typeof args.url !== "string" || args.url === "") {
			throw new Error("URL not present in options.");
		}

		const parsedUrl = URL.parse(args.url);

		this.url = parsedUrl.host;
		this.protocol = parsedUrl.protocol;
		this.credentials = parsedUrl.auth;
		this.appname = args.appname || args.app;

		if (typeof this.appname !== "string" || this.appname === "") {
			throw new Error("App name is not present in options.");
		}

		if (typeof this.protocol !== "string" || this.protocol === "") {
			throw new Error("Protocol is not present in url. URL should be of the form https://scalr.api.appbase.io");
		}

		if (typeof args.username === "string" && args.username !== "" && typeof args.password === "string" && args.password !== "") {
			this.credentials = `${args.username}:${args.password}`;
		}

		// credentials can be provided as a part of the URL, as username, password args or
		// as a credentials argument directly
		if (typeof args.credentials === "string" && args.credentials !== "") {
			this.credentials = args.credentials;
		}

		if (typeof this.credentials !== "string" || this.credentials === "") {
			throw new Error("Authentication information is not present. Did you add credentials?");
		}

		if (parsedUrl.protocol === "https:") {
			this.ws = new betterWs(`wss://${parsedUrl.host}/${this.appname}`);
		} else {
			this.ws = new betterWs(`ws://${parsedUrl.host}/${this.appname}`);
		}

		if (this.url.slice(-1) === "/") {
			this.url = this.url.slice(0, -1);
		}

		return client;
	}

	performWsRequest(args) {
		return new wsRequest(this, JSON.parse(JSON.stringify(args)))
	}

	performStreamingRequest(args) {
		return new wsRequest(this, JSON.parse(JSON.stringify(args)))
	}

	performFetchRequest(args) {
		return new fetchRequest(this, JSON.parse(JSON.stringify(args)))
	}

	index(args) {
		return new indexService(this, JSON.parse(JSON.stringify(args)))
	}

	get(args) {
		return new getService(this, JSON.parse(JSON.stringify(args)))
	}

	update(args) {
		return new updateService(this, JSON.parse(JSON.stringify(args)))
	}

	delete(args) {
		return new deleteService(this, JSON.parse(JSON.stringify(args)))
	}

	bulk(args) {
		return new bulkService(this, JSON.parse(JSON.stringify(args)))
	}

	search(args) {
		return new searchService(this, JSON.parse(JSON.stringify(args)))
	}

	getStream(args) {
		return new streamDocumentService(this, JSON.parse(JSON.stringify(args)))
	}

	searchStream(args) {
		return new streamSearchService(this, JSON.parse(JSON.stringify(args)))
	}

	searchStreamToURL(args, webhook) {
		return new addWebhookService(this, JSON.parse(JSON.stringify(args)), JSON.parse(JSON.stringify(webhook)))
	}

	getTypes() {
		return new getTypesService(this)
	}

	getMappings() {
		return new getMappingsService(this)
	}
}

if (typeof window !== "undefined") {
	window.Appbase = AppbaseClient;
}

export default AppbaseClient;