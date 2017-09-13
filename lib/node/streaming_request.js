"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hyperquest = require("hyperquest");

var _hyperquest2 = _interopRequireDefault(_hyperquest);

var _JSONStream = require("JSONStream");

var _JSONStream2 = _interopRequireDefault(_JSONStream);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _through = require("through2");

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var streamingRequest = function () {
    function streamingRequest(client, args) {
        _classCallCheck(this, streamingRequest);

        this.client = client;
        this.args = args;

        this.method = args.method;
        this.path = args.path;
        this.params = args.params;
        this.body = args.body;

        if (!this.body || !(_typeof(this.body) === "object" || this.body.constructor === Array)) {
            this.body = {};
        }

        if (this.body.constructor === Array) {
            var arrayBody = this.body;
            this.body = "";
            for (var i = 0; i < arrayBody.length; i++) {
                this.body += JSON.stringify(arrayBody[i]);
                this.body += "\n";
            }
        }

        var resultStream = this.init();

        return resultStream;
    }

    _createClass(streamingRequest, [{
        key: "init",
        value: function init() {
            var that = this;

            this.requestStream = (0, _hyperquest2.default)({
                method: this.method,
                uri: this.client.protocol + "//" + this.client.url + "/" + this.client.appname + "/" + this.path + "?" + _querystring2.default.stringify(this.params),
                auth: this.client.credentials
            });

            this.requestStream.on("response", function (res) {
                that.response = res;
            });

            this.requestStream.on("request", function (req) {
                that.request = req;
            });

            var resultStream = this.requestStream.pipe(_JSONStream2.default.parse()).pipe(_through2.default.obj());

            this.requestStream.on("end", function () {
                that.stop.apply(that);
            });

            resultStream.on("end", function () {
                that.stop.apply(that);
            });

            this.requestStream.on("error", function (err) {
                that.stop.apply(that);
                process.nextTick(function () {
                    resultStream.emit("error", err);
                });
            });

            resultStream.stop = this.stop.bind(this);
            resultStream.reconnect = this.reconnect.bind(this);

            if (this.requestStream.writable) {
                if (typeof this.body === "string") {
                    this.requestStream.end(this.body);
                } else {
                    this.requestStream.end(JSON.stringify(this.body));
                }
            }

            return resultStream;
        }
    }, {
        key: "getId",
        value: function getId(callback) {
            if (this.response) {
                callback(this.response.headers["query-id"]);
            } else {
                this.requestStream.on("response", function (res) {
                    callback(res.headers["query-id"]);
                });
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.request) {
                this.request.destroy();
            } else {
                this.requestStream.on("request", function (req) {
                    req.destroy();
                });
            }
        }
    }, {
        key: "reconnect",
        value: function reconnect() {
            this.stop();
            return new streamingRequest(this.client, this.args);
        }
    }]);

    return streamingRequest;
}();

exports.default = streamingRequest;