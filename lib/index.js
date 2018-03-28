"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlParserLite = require("url-parser-lite");

var _urlParserLite2 = _interopRequireDefault(_urlParserLite);

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

var _msearch = require("./actions/msearch.js");

var _msearch2 = _interopRequireDefault(_msearch);

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

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (typeof window !== "undefined" && !window._babelPolyfill || global && !global._babelPolyfill) {
	require("babel-polyfill");
}

var AppbaseClient = function () {
	function AppbaseClient(args) {
		_classCallCheck(this, AppbaseClient);

		if (typeof args.url !== "string" || args.url === "") {
			throw new Error("URL not present in options.");
		}

		var _URL = (0, _urlParserLite2.default)(args.url),
		    _URL$auth = _URL.auth,
		    auth = _URL$auth === undefined ? null : _URL$auth,
		    _URL$host = _URL.host,
		    host = _URL$host === undefined ? "" : _URL$host,
		    _URL$path = _URL.path,
		    path = _URL$path === undefined ? "" : _URL$path,
		    _URL$protocol = _URL.protocol,
		    protocol = _URL$protocol === undefined ? "" : _URL$protocol;

		this.url = host + path;
		this.protocol = protocol;
		this.credentials = auth || null;
		this.appname = args.appname || args.app;
		this.headers = {};

		if (typeof this.appname !== "string" || this.appname === "") {
			throw new Error("App name is not present in options.");
		}

		if (typeof this.protocol !== "string" || this.protocol === "") {
			throw new Error("Protocol is not present in url. URL should be of the form https://scalr.api.appbase.io");
		}

		// credentials can be provided as a part of the URL, as username, password args or
		// as a credentials argument directly
		if (typeof args.credentials === "string" && args.credentials !== "") {
			this.credentials = args.credentials;
		} else if (typeof args.username === "string" && args.username !== "" && typeof args.password === "string" && args.password !== "") {
			this.credentials = args.username + ":" + args.password;
		}

		if ((0, _helpers.isAppbase)(this) && this.credentials === null) {
			throw new Error("Authentication information is not present. Did you add credentials?");
		}

		if ((0, _helpers.isAppbase)(this)) {
			try {
				this.ws = new _better_websocket2.default("wss://" + this.url + "/" + this.appname);
			} catch (e) {
				console.error(e);
			}
		}

		if (this.url.slice(-1) === "/") {
			this.url = this.url.slice(0, -1);
		}

		return this;
	}

	_createClass(AppbaseClient, [{
		key: "setHeaders",
		value: function setHeaders(headers) {
			this.headers = headers;
		}
	}, {
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
		key: "msearch",
		value: function msearch(args) {
			return new _msearch2.default(this, JSON.parse(JSON.stringify(args)));
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