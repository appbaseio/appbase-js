import querystring from 'querystring';
import {
 uuidv4, btoa, removeUndefined, waitForSocketConnection,
} from '../../utils/index';

const WebSocket = typeof window !== 'undefined' ? window.WebSocket : require('ws');

/**
 * To connect a web socket
 * @param {Object} args
 * @param {String} args.method
 * @param {String} args.path
 * @param {Object} args.params
 * @param {Object} args.body
 */
function wsRequest(args, onData, onError, onClose) {
  try {
    const parsedArgs = removeUndefined(args);
    const { method, path, params } = parsedArgs;
    let bodyCopy = args.body;
    if (!bodyCopy || typeof bodyCopy !== 'object') {
      bodyCopy = {};
    }
    const init = () => {
      this.ws = new WebSocket(`wss://${this.url}/${this.app}`);
      this.id = uuidv4();

      this.request = {
        id: this.id,
        path: `${this.app}/${path}?${querystring.stringify(params)}`,
        method,
        body: bodyCopy,
      };
      if (this.credentials) {
        this.request.authorization = `Basic ${btoa(this.credentials)}`;
      }
      // this.resultStream = new Stream();
      // this.resultStream.readable = true;
      this.result = {};
      this.closeHandler = () => {
        this.wsClosed();
      };
      this.errorHandler = (err) => {
        this.processError(...[err]);
      };
      this.messageHandler = (message) => {
        const dataObj = JSON.parse(message.data);
        if (dataObj.body && dataObj.body.status >= 400) {
          this.processError(...[dataObj]);
        } else {
          this.processMessage(...[dataObj]);
        }
      };
      this.send = (request) => {
        waitForSocketConnection(this.ws, () => {
          try {
            this.ws.send(JSON.stringify(request));
          } catch (e) {
            console.warn(e);
          }
        });
      };
      this.ws.onmessage = this.messageHandler;
      this.ws.onerror = this.errorHandler;
      this.ws.onclose = this.closeHandler;
      this.send(this.request);
      this.result.stop = this.stop;
      this.result.reconnect = this.reconnect;

      return this.result;
    };
    this.wsClosed = () => {
      if (onClose) {
        onClose();
      }
    };
    this.stop = () => {
      this.ws.onmessage = undefined;
      this.ws.onclose = undefined;
      this.ws.onerror = undefined;
      this.wsClosed();
      const unsubRequest = JSON.parse(JSON.stringify(this.request));
      unsubRequest.unsubscribe = true;

      if (this.unsubscribed !== true) {
        this.send(unsubRequest);
      }

      this.unsubscribed = true;
    };
    this.reconnect = () => {
      this.stop();
      return wsRequest(args, onData, onError, onClose);
    };
    this.processError = (err) => {
      if (onError) {
        onError(err);
      }
    };

    this.processMessage = (origDataObj) => {
      const dataObj = JSON.parse(JSON.stringify(origDataObj));
      if (!dataObj.id && dataObj.message) {
        if (onError) {
          onError(dataObj);
        }
        return;
      }

      if (dataObj.id === this.id) {
        if (dataObj.message) {
          delete dataObj.id;
          if (onError) {
            onError(dataObj);
          }
          return;
        }

        if (dataObj.query_id) {
          this.query_id = dataObj.query_id;
        }

        if (dataObj.channel) {
          this.channel = dataObj.channel;
        }

        if (dataObj.body && dataObj.body !== '') {
          if (onData) {
            onData(dataObj.body);
          }
        }

        return;
      }

      if (!dataObj.id && dataObj.channel && dataObj.channel === this.channel) {
        if (onData) {
          onData(dataObj.event);
        }
      }
    };
    return init();
  } catch (e) {
    if (onError) {
      onError(e);
    } else {
      console.warn(e);
    }
    return null;
  }
}
export default wsRequest;
