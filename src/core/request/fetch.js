import querystring from 'querystring';
import fetch from 'cross-fetch';
import { btoa, removeUndefined } from '../../utils/index';

/**
 * To perform fetch request
 * @param {Object} args
 * @param {String} args.method
 * @param {String} args.path
 * @param {Object} args.params
 * @param {Object} args.body
 */
function fetchRequest(args) {
  return new Promise((resolve, reject) => {
    const parsedArgs = removeUndefined(args);
    try {
      const {
 method, path, params, body,
} = parsedArgs;
      let bodyCopy = body;
      const contentType = path.endsWith('msearch') || path.endsWith('bulk')
          ? 'application/x-ndjson'
          : 'application/json';
      const headers = Object.assign(
        {},
        {
          Accept: 'application/json',
          'Content-Type': contentType,
        },
        this.headers,
      );
      const timestamp = Date.now();
      if (this.credentials) {
        headers.Authorization = `Basic ${btoa(this.credentials)}`;
      }
      const requestOptions = {
        method,
        headers,
      };
      if (Array.isArray(bodyCopy)) {
        let arrayBody = '';
        bodyCopy.forEach((item) => {
          arrayBody += JSON.stringify(item);
          arrayBody += '\n';
        });

        bodyCopy = arrayBody;
      } else {
        bodyCopy = JSON.stringify(bodyCopy) || {};
      }

      if (Object.keys(bodyCopy).length !== 0) {
        requestOptions.bodyCopy = bodyCopy;
      }

      let finalRequest = requestOptions;
      if (this.beforeSend) {
        finalRequest = this.beforeSend(requestOptions);
      }

      return fetch(
        `${this.protocol}://${this.url}/${this.appname}/${path}?${querystring.stringify(params)}`,
        finalRequest,
      )
        .then(res => res.json())
        .then((data) => {
          const response = Object.assign({}, data, {
            _timestamp: timestamp,
          });
          return resolve(response);
        });
    } catch (e) {
      return reject(e);
    }
  });
}
export default fetchRequest;
