"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("babel-polyfill");

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _fetch_request = require("./fetch_request.js");

var _fetch_request2 = _interopRequireDefault(_fetch_request);

var _better_websocket = require("./better_websocket.js");

var _better_websocket2 = _interopRequireDefault(_better_websocket);

var _websocket_request = require("./websocket_request.js");

var _websocket_request2 = _interopRequireDefault(_websocket_request);

var _index = require("./actions/index.js");

var _index2 = _interopRequireDefault(_index);

var _get = require("./actions/get.js");

var _get2 = _interopRequireDefault(_get);

var _update = require("./actions/update.js");

var _update2 = _interopRequireDefault(_update);

var _delete2 = require("./actions/delete.js");

var _delete3 = _interopRequireDefault(_delete2);

var _bulk = require("./actions/bulk.js");

var _bulk2 = _interopRequireDefault(_bulk);

var _search = require("./actions/search.js");

var _search2 = _interopRequireDefault(_search);

var _get_types = require("./actions/get_types.js");

var _get_types2 = _interopRequireDefault(_get_types);

var _get_mappings = require("./actions/get_mappings.js");

var _get_mappings2 = _interopRequireDefault(_get_mappings);

var _webhook = require("./actions/webhook.js");

var _webhook2 = _interopRequireDefault(_webhook);

var _stream_document = require("./actions/stream_document.js");

var _stream_document2 = _interopRequireDefault(_stream_document);

var _stream_search = require("./actions/stream_search.js");

var _stream_search2 = _interopRequireDefault(_stream_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppbaseClient = function () {
	function AppbaseClient(args) {
		_classCallCheck(this, AppbaseClient);

		if (typeof args.url !== "string" || args.url === "") {
			throw new Error("URL not present in options.");
		}

		var parsedUrl = _url2.default.parse(args.url);

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
			this.credentials = args.username + ":" + args.password;
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
			this.ws = new _better_websocket2.default("wss://" + parsedUrl.host + "/" + this.appname);
		} else {
			this.ws = new _better_websocket2.default("ws://" + parsedUrl.host + "/" + this.appname);
		}

		if (this.url.slice(-1) === "/") {
			this.url = this.url.slice(0, -1);
		}

		return this;
	}

	_createClass(AppbaseClient, [{
		key: "performWsRequest",
		value: function performWsRequest(args) {
			return new _websocket_request2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "performStreamingRequest",
		value: function performStreamingRequest(args) {
			return new _websocket_request2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "performFetchRequest",
		value: function performFetchRequest(args) {
			return new _fetch_request2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "index",
		value: function index(args) {
			return new _index2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "get",
		value: function get(args) {
			return new _get2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "update",
		value: function update(args) {
			return new _update2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "delete",
		value: function _delete(args) {
			return new _delete3.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "bulk",
		value: function bulk(args) {
			return new _bulk2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "search",
		value: function search(args) {
			return new _search2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "getStream",
		value: function getStream(args) {
			return new _stream_document2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "searchStream",
		value: function searchStream(args) {
			return new _stream_search2.default(this, JSON.parse(JSON.stringify(args)));
		}
	}, {
		key: "searchStreamToURL",
		value: function searchStreamToURL(args, webhook) {
			return new _webhook2.default(this, JSON.parse(JSON.stringify(args)), JSON.parse(JSON.stringify(webhook)));
		}
	}, {
		key: "getTypes",
		value: function getTypes() {
			return new _get_types2.default(this);
		}
	}, {
		key: "getMappings",
		value: function getMappings() {
			return new _get_mappings2.default(this);
		}
	}]);

	return AppbaseClient;
}();

if (typeof window !== "undefined") {
	window.Appbase = AppbaseClient;
}

exports.default = AppbaseClient;
module.exports = exports["default"];