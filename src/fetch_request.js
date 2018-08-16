import querystring from 'querystring';
import Stream from 'stream';
import fetch from 'cross-fetch';
import { btoa } from './helpers';

export default class FetchRequest {
  constructor(client, args) {
    this.client = client;
    this.args = args;

    this.method = args.method;
    this.path = args.path;
    this.params = args.params;
    this.body = args.body;

    this.resultStream = new Stream();
    this.resultStream.readable = true;
    const contentType = args.path.endsWith('msearch') || args.path.endsWith('bulk')
        ? 'application/x-ndjson'
        : 'application/json';

    const headers = Object.assign(
      {},
      {
        Accept: 'application/json',
        'Content-Type': contentType,
      },
      client.headers,
    );

    const timestamp = Date.now();

    if (this.client.credentials) {
      headers.Authorization = `Basic ${btoa(this.client.credentials)}`;
    }

    const requestOptions = {
      method: this.method,
      headers,
    };

    if (Array.isArray(this.body)) {
      let arrayBody = '';
      this.body.forEach((item) => {
        arrayBody += JSON.stringify(item);
        arrayBody += '\n';
      });

      this.body = arrayBody;
    } else {
      this.body = JSON.stringify(this.body) || {};
    }

    if (Object.keys(this.body).length !== 0) {
      requestOptions.body = this.body;
    }

    let finalRequest = requestOptions;
    if (this.client.beforeSend) {
      finalRequest = this.client.beforeSend(requestOptions);
    }

    fetch(
      `${this.client.protocol}://${this.client.url}/${this.client.appname}/${
        this.path
      }?${querystring.stringify(this.params)}`,
      finalRequest,
    )
      .then((res) => {
        if (res.status >= 500) {
          this.resultStream.emit('error', res);
          return;
        }

        res.json().then((data) => {
          if (res.status >= 400) {
            this.resultStream.emit('error', res);
            return;
          }
          const response = Object.assign({}, data, {
            _timestamp: timestamp,
          });

          this.resultStream.emit('data', response);
          this.resultStream.emit('end');
        });
      })
      .catch((e) => {
        this.resultStream.emit('error', e);
      });

    this.resultStream.on('data', (res) => {
      this.response = res;
    });

    this.resultStream.stop = this.stop.bind(this);
    this.resultStream.reconnect = this.reconnect.bind(this);

    return this.resultStream;
  }

  getId(callback) {
    if (this.response) {
      callback(this.response.headers['query-id']);
    } else {
      this.resultStream.on('data', (res) => {
        callback(res.headers['query-id']);
      });
    }
  }

  stop() {
    this.resultStream.emit('end');
  }

  reconnect() {
    this.stop();
    return new FetchRequest(this.client, this.args);
  }
}
