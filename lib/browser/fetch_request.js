"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetchReuest = function fetchReuest(client, args) {
  _classCallCheck(this, fetchReuest);

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

  return fetch(this.client.protocol + "//" + this.client.url + "/" + this.client.appname + "/" + this.path + "?" + _querystring2.default.stringify(this.params), {
    method: this.method,
    headers: {
      "Authorization": "Basic " + btoa(this.client.credentials),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: this.body
  }).then(function (res) {
    return res.json();
  });
};

exports.default = fetchReuest;