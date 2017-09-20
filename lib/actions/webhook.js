"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonStableStringify = require("json-stable-stringify");

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addWebhookService = function () {
	function addWebhookService(client, args, webhook) {
		_classCallCheck(this, addWebhookService);

		var valid = (0, _helpers.validate)(args, {
			"body": "object"
		});
		if (valid !== true) {
			throw valid;
		}

		if (args.type === undefined || !(typeof args.type === "string" || Array.isArray(args.type)) || args.type === "" || args.type.length === 0) {
			throw new Error("fields missing: type");
		}

		valid = (0, _helpers.validate)(args.body, {
			"query": "object"
		});
		if (valid !== true) {
			throw valid;
		}

		if (Array.isArray(args.type)) {
			this.type = args.type;
			this.type_string = args.type.join();
		} else {
			this.type = [args.type];
			this.type_string = args.type;
		}

		this.webhooks = [];
		this.client = client;
		this.query = args.body.query;

		if (typeof webhook === "string") {
			var webhook_obj = {};
			webhook_obj.url = webhook;
			webhook_obj.method = "GET";
			this.webhooks.push(webhook_obj);
		} else if (webhook.constructor === Array) {
			this.webhooks = webhook;
		} else if (webhook === Object(webhook)) {
			this.webhooks.push(webhook);
		} else {
			throw new Error("fields missing: second argument(webhook) is necessary");
		}

		this.populateBody();

		var encode64 = (0, _helpers.btoa)((0, _jsonStableStringify2.default)(this.query));
		var path = ".percolator/webhooks-0-" + this.type_string + "-0-" + encode64;

		this.path = path;

		return this.performRequest("POST");
	}

	_createClass(addWebhookService, [{
		key: "populateBody",
		value: function populateBody() {
			this.body = {};
			this.body.webhooks = this.webhooks;
			this.body.query = this.query;
			this.body.type = this.type;
		}
	}, {
		key: "performRequest",
		value: function performRequest(method) {
			var res = this.client.performWsRequest({
				method: method,
				path: this.path,
				body: this.body
			});

			res.change = this.change.bind(this);
			res.stop = this.stop.bind(this);

			return res;
		}
	}, {
		key: "change",
		value: function change(args) {
			this.webhooks = [];

			if (typeof args === "string") {
				var webhook = {};
				webhook.url = args;
				webhook.method = "POST";
				this.webhooks.push(webhook);
			} else if (args.constructor === Array) {
				this.webhooks = args;
			} else if (args === Object(args)) {
				this.webhooks.push(args);
			} else {
				throw new Error("fields missing: one of webhook or url fields is required");
				return;
			}

			this.populateBody();

			return this.performRequest("POST");
		}
	}, {
		key: "stop",
		value: function stop() {
			delete this.body;

			return this.performRequest("DELETE");
		}
	}]);

	return addWebhookService;
}();

exports.default = addWebhookService;
module.exports = exports["default"];