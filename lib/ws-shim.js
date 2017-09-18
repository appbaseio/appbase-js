"use strict";

var ws = void 0;

if (typeof WebSocket !== "undefined") {
	ws = WebSocket;
} else if (typeof MozWebSocket !== "undefined") {
	ws = MozWebSocket;
} else {
	ws = window.WebSocket || window.MozWebSocket;
}

module.exports = ws;