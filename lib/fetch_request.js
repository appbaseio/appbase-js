"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _helpers = require("./helpers");

var _crossFetch = require("cross-fetch");

var _crossFetch2 = _interopRequireDefault(_crossFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetchRequest = function () {
	function fetchRequest(client, args) {
		var _this = this;

		_classCallCheck(this, fetchRequest);

		this.client = client;
		this.args = args;

		this.method = args.method;
		this.path = args.path;
		this.params = args.params;
		this.body = args.body;

		this.resultStream = new _stream2.default();
		this.resultStream.readable = true;
		var contentType = args.path.endsWith("msearch") || args.path.endsWith("bulk") ? "application/x-ndjson" : "application/json";

		var headers = Object.assign({}, {
			"Accept": "application/json",
			"Content-Type": contentType
		}, client.headers);

		var timestamp = Date.now();

		if (this.client.credentials) {
			headers.Authorization = "Basic " + (0, _helpers.btoa)(this.client.credentials);
		}

		var requestOptions = {
			method: this.method,
			headers: headers
		};

		if (Array.isArray(this.body)) {
			var arrayBody = "";

			this.body.map(function (item) {
				arrayBody += JSON.stringify(item);
				arrayBody += "\n";
			});

			this.body = arrayBody;
		} else {
			this.body = JSON.stringify(this.body) || {};
		}

		if (Object.keys(this.body).length !== 0) {
			requestOptions.body = this.body;
		}

		(0, _crossFetch2.default)(this.client.protocol + "://" + this.client.url + "/" + this.client.appname + "/" + this.path + "?" + _querystring2.default.stringify(this.params), requestOptions).then(function (res) {
			res.json().then(function (data) {
				if (res.status >= 400) {
					_this.resultStream.emit("error", res);
					return;
				}
				var response = Object.assign({}, data, {
					_timestamp: timestamp
				});

				_this.resultStream.emit("data", response);
				_this.resultStream.emit("end");
			});
		}).catch(function (e) {
			_this.resultStream.emit("error", e);
		});

		this.resultStream.on("data", function (res) {
			_this.response = res;
		});

		this.resultStream.stop = this.stop.bind(this);
		this.resultStream.reconnect = this.reconnect.bind(this);

		return this.resultStream;
	}

	_createClass(fetchRequest, [{
		key: "getId",
		value: function getId(callback) {
			if (this.response) {
				callback(this.response.headers["query-id"]);
			} else {
				this.resultStream.on("data", function (res) {
					callback(res.headers["query-id"]);
				});
			}
		}
	}, {
		key: "stop",
		value: function stop() {
			this.resultStream.emit("end");
		}
	}, {
		key: "reconnect",
		value: function reconnect() {
			this.stop();
			return new fetchRequest(this.client, this.args);
		}
	}]);

	return fetchRequest;
}();

exports.default = fetchRequest;


function isJson(arr) {
	try {
		var str = Utf8ArrayToStr(arr);
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

function Utf8ArrayToStr(array) {
	var out = void 0;
	var i = void 0;
	var len = void 0;
	var c = void 0;
	var char2 = void 0;
	var char3 = void 0;

	out = "";
	len = array.length;
	i = 0;

	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
				// 0xxxxxxx
				out += String.fromCharCode(c);
				break;
			case 12:case 13:
				// 110x xxxx   10xx xxxx
				char2 = array[i++];
				out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
				break;
		}
	}

	return out;
}
module.exports = exports["default"];