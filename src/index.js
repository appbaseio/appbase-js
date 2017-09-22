import "babel-polyfill";

import URL from "url";
import Guid from "guid";
import fetchRequest from "./fetch_request.js";
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
import { isAppbase } from "./helpers";

let client = null;

class AppbaseClient {
	constructor(args) {
		if (!client) {
			client = this;
		}

		if (typeof args.url !== "string" || args.url === "") {
			throw new Error("URL not present in options.");
		}

		const parsedUrl = URL.parse(args.url);

		this.url = parsedUrl.host;
		this.protocol = parsedUrl.protocol;
		this.credentials = parsedUrl.auth;
		this.appname = args.appname || args.app || args.index;
		this.channel_id = Guid.raw().replace(/-/g, "");

		/* appname is not required in Streams; there, it can be passed
		   as index name and on each request*/

		if (isAppbase(this) && (typeof this.appname !== "string" || this.appname === "")) {
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

		/* credentials are not required for Streams */
		if (isAppbase(this) && (typeof this.credentials !== "string" || this.credentials === "")) {
			throw new Error("Authentication information is not present. Did you add credentials?");
		}

		const streamPath = isAppbase(client) ? "" : `/_streams/sub/${this.channel_id}`;

		if (parsedUrl.protocol === "https:") {
			const appname = isAppbase(this) ? `/${this.appname}` : "";
			const url = `wss://${this.credentials}@${parsedUrl.host}${appname}${streamPath}`;
			console.log(url);
			this.ws = new betterWs(url);
		} else {
			const appname = isAppbase(this) ? `/${this.appname}` : "";
			const url = `ws://${this.credentials}@${parsedUrl.host}${appname}${streamPath}`;
			console.log(url);
			this.ws = new betterWs(url);
		}

		if (this.url.slice(-1) === "/") {
			this.url = this.url.slice(0, -1);
		}

		return client;
	}

	performWsRequest(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new wsRequest(this, JSON.parse(JSON.stringify(args)));
	}

	performStreamingRequest(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new wsRequest(this, JSON.parse(JSON.stringify(args)));
	}

	performFetchRequest(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new fetchRequest(this, JSON.parse(JSON.stringify(args)));
	}

	index(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new indexService(this, JSON.parse(JSON.stringify(args)));
	}

	get(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new getService(this, JSON.parse(JSON.stringify(args)));
	}

	update(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new updateService(this, JSON.parse(JSON.stringify(args)));
	}

	delete(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new deleteService(this, JSON.parse(JSON.stringify(args)));
	}

	bulk(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new bulkService(this, JSON.parse(JSON.stringify(args)));
	}

	search(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new searchService(this, JSON.parse(JSON.stringify(args)));
	}

	getStream(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new streamDocumentService(this, JSON.parse(JSON.stringify(args)));
	}

	searchStream(args) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new streamSearchService(this, JSON.parse(JSON.stringify(args)));
	}

	searchStreamToURL(args, webhook) {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new addWebhookService(this, JSON.parse(JSON.stringify(args)), JSON.parse(JSON.stringify(webhook)));
	}

	getTypes() {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new getTypesService(this);
	}

	getMappings() {
		if (!this.appname) {
			this.appname = args.index;
		}
		return new getMappingsService(this);
	}
}

if (typeof window !== "undefined") {
	window.Appbase = AppbaseClient;
}

export default AppbaseClient;
