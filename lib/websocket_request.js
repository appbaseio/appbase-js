"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require("eventemitter2").EventEmitter2;

var wsRequest = function () {
	function wsRequest(client, args) {
		_classCallCheck(this, wsRequest);

		this.client = client;
		this.args = args;

		this.method = args.method;
		this.path = args.path;
		this.params = args.params;
		this.body = args.body;
		if (!this.body || _typeof(this.body) !== "object") {
			this.body = {};
		}

		var resultStream = this.init();

		return resultStream;
	}

	_createClass(wsRequest, [{
		key: "init",
		value: function init() {
			var _this = this;

			var that = this;

			this.id = (0, _helpers.uuidv4)();

			this.request = {
				id: this.id,
				path: this.client.appname + "/" + this.path + "?" + _querystring2.default.stringify(this.params),
				method: this.method,
				body: this.body
			};

			if (this.client.credentials) {
				this.request.authorization = "Basic " + (0, _helpers.btoa)(this.client.credentials);
			}

			this.resultStream = new _stream2.default();
			this.resultStream.readable = true;

			this.closeHandler = function () {
				_this.wsClosed();
			};
			this.errorHandler = function (err) {
				_this.processError.apply(_this, [err]);
			};
			this.messageHandler = function (dataObj) {
				if (dataObj.body && dataObj.body.status >= 400) {
					_this.processError.apply(_this, [dataObj]);
				} else {
					_this.processMessage.apply(_this, [dataObj]);
				}
			};

			this.client.ws.on("close", this.closeHandler);
			this.client.ws.on("error", this.errorHandler);
			this.client.ws.on("message", this.messageHandler);

			this.client.ws.send(this.request);

			this.resultStream.stop = this.stop.bind(this);
			this.resultStream.reconnect = this.reconnect.bind(this);

			return this.resultStream;
		}
	}, {
		key: "wsClosed",
		value: function wsClosed() {
			this.resultStream.emit("end");
		}
	}, {
		key: "processError",
		value: function processError(err) {
			this.resultStream.emit("error", err);
		}
	}, {
		key: "processMessage",
		value: function processMessage(origDataObj) {
			var dataObj = JSON.parse(JSON.stringify(origDataObj));

			if (!dataObj.id && dataObj.message) {
				this.resultStream.emit("error", dataObj);
				return;
			}

			if (dataObj.id === this.id) {
				if (dataObj.message) {
					delete dataObj.id;
					this.resultStream.emit("error", dataObj);
					return;
				}

				if (dataObj.query_id) {
					this.query_id = dataObj.query_id;
				}

				if (dataObj.channel) {
					this.channel = dataObj.channel;
				}

				if (dataObj.body && dataObj.body !== "") {
					this.resultStream.emit("data", dataObj.body);
				}

				return;
			}

			if (!dataObj.id && dataObj.channel && dataObj.channel === this.channel) {
				this.resultStream.emit("data", dataObj.event);
				return;
			}
		}
	}, {
		key: "getId",
		value: function getId(callback) {
			var _this2 = this;

			if (this.query_id) {
				callback(this.query_id);
			} else {
				this.client.ws.on("message", function (data) {
					var dataObj = JSON.parse(data);
					if (dataObj.id === _this2.id) {
						if (dataObj.query_id) {
							_this2.client.ws.removeListener("message", _this2.id);
							callback(_this2.id);
						}
					}
				});
			}
		}
	}, {
		key: "stop",
		value: function stop() {
			this.client.ws.removeListener("close", this.closeHandler);
			this.client.ws.removeListener("error", this.errorHandler);
			this.client.ws.removeListener("message", this.messageHandler);
			this.resultStream.emit("end");

			var unsubRequest = JSON.parse(JSON.stringify(this.request));
			unsubRequest.unsubscribe = true;

			if (this.unsubscribed !== true) {
				this.client.ws.send(unsubRequest);
			}

			this.unsubscribed = true;
		}
	}, {
		key: "reconnect",
		value: function reconnect() {
			this.stop();
			return new wsRequest(this.client, this.args);
		}
	}]);

	return wsRequest;
}();

exports.default = wsRequest;
module.exports = exports["default"];