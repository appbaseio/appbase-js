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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("fetch-everywhere");

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

		this.resultStream = new _stream2.default();
		this.resultStream.readable = true;

		var uri = this.client.protocol + "//" + this.client.url + "/" + this.client.appname + "/" + this.path + "?" + _querystring2.default.stringify(this.params);

		fetch(uri, {
			method: this.method,
			headers: {
				"Authorization": "Basic " + (0, _helpers.btoa)(this.client.credentials),
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: this.body
		}).then(function (res) {
			res.json().then(function (data) {
				_this.resultStream.emit("data", data);
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
module.exports = exports["default"];