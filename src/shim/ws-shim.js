let ws;

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket;
} else if (typeof MozWebSocket !== 'undefined') {
  // eslint-disable-next-line
  ws = MozWebSocket;
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket;
}

module.exports = ws;
