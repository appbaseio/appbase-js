const WebSocket = (typeof window !== "undefined") ? window.WebSocket : require("ws");
const EventEmitter = require("eventemitter2").EventEmitter2;

const betterWs = function betterWs(url) {
	const conn = new WebSocket(url);
	const ee = new EventEmitter();

	ee.setMaxListeners(0);

	ee.send = function(dataObj) {
		if (conn.readyState !== 1) {
			ee.on("open", function sender() {
				conn.send(JSON.stringify(dataObj));
				ee.removeListener("open", sender);
			});
		} else {
			conn.send(JSON.stringify(dataObj));
			return this;
		}
	};

	conn.onopen = () => {
		ee.emit("open");
	};

	conn.onmessage = message => {
		const dataObj = JSON.parse(message.data);
		ee.emit("message", dataObj);
	};

	conn.onerror = err => {
		ee.emit("error", err);
	};

	conn.onclose = close => {
		ee.emit("close", close);
	};

	return ee;
};

export default betterWs;