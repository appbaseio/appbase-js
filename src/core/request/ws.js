import querystring from 'querystring';
import Stream from 'stream';
import { uuidv4, btoa, removeUndefined } from '../../utils/index';

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
      const id = uuidv4();

      this.request = {
        id,
        path: `${this.appname}/${path}?${querystring.stringify(params)}`,
        method,
        body: bodyCopy,
      };

      if (this.credentials) {
        this.request.authorization = `Basic ${btoa(this.credentials)}`;
      }

      this.resultStream = new Stream();
      this.resultStream.readable = true;

      this.closeHandler = () => {
        this.wsClosed();
      };
      this.errorHandler = (err) => {
        this.processError(...[err]);
      };
      this.messageHandler = (dataObj) => {
        if (dataObj.body && dataObj.body.status >= 400) {
          this.processError(...[dataObj]);
        } else {
          this.processMessage(...[dataObj]);
        }
      };
      if (onClose) {
        this.client.ws.on('close', this.closeHandler);
      }
      if (onError) {
        this.client.ws.on('error', onError);
      }
      this.client.ws.on('message', this.messageHandler);

      this.client.ws.send(this.request);

      this.resultStream.stop = this.stop;
      this.resultStream.reconnect = this.reconnect;

      return this.resultStream;
    };
    const resultStream = init();
    this.wsClosed = () => {
      resultStream.emit('end');
    };
    this.stop = () => {
      if (onClose) {
        this.client.ws.removeListener('close', this.closeHandler);
      }

      if (onError) {
        this.client.ws.removeListener('error', onError);
      }
      this.client.ws.removeListener('message', this.messageHandler);
      this.resultStream.emit('end');

      const unsubRequest = JSON.parse(JSON.stringify(this.request));
      unsubRequest.unsubscribe = true;

      if (this.unsubscribed !== true) {
        this.client.ws.send(unsubRequest);
      }

      this.unsubscribed = true;
    };
    this.reconnect = () => {
      this.stop();
      return wsRequest(args, onData, onError, onClose);
    };
    this.processError = (err) => {
      this.resultStream.emit('error', err);
    };

    this.processMessage = (origDataObj) => {
      const dataObj = JSON.parse(JSON.stringify(origDataObj));

      if (!dataObj.id && dataObj.message) {
        this.resultStream.emit('error', dataObj);
        return;
      }

      if (dataObj.id === this.id) {
        if (dataObj.message) {
          delete dataObj.id;
          this.resultStream.emit('error', dataObj);
          return;
        }

        if (dataObj.query_id) {
          this.query_id = dataObj.query_id;
        }

        if (dataObj.channel) {
          this.channel = dataObj.channel;
        }

        if (dataObj.body && dataObj.body !== '') {
          this.resultStream.emit('data', dataObj.body);
        }

        return;
      }

      if (!dataObj.id && dataObj.channel && dataObj.channel === this.channel) {
        this.resultStream.emit('data', dataObj.event);
      }
    };
    return resultStream;
  } catch (e) {
    if (onError) {
      onError(e);
    } else {
      console.error(e);
    }
    return null;
  }
}
export default wsRequest;
