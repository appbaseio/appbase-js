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
 * @param {Object} args.headers
 * @param {boolean} args.isSuggestionsAPI
 */
function fetchRequest(args) {
  return new Promise((resolve, reject) => {
    const parsedArgs = removeUndefined(args);
    try {
      const {
        method,
        path,
        params,
        body,
        isRSAPI,
        isSuggestionsAPI,
        isMongoRequest = false,
      } = parsedArgs;
      const app = isSuggestionsAPI ? '.suggestions' : this.app;
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
        args.headers,
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
        requestOptions.body = bodyCopy;
      }

      const handleTransformRequest = (res) => {
        if (
          this.transformRequest
          && typeof this.transformRequest === 'function'
        ) {
          const tarnsformRequestPromise = this.transformRequest(res);
          return tarnsformRequestPromise instanceof Promise
            ? tarnsformRequestPromise
            : Promise.resolve(tarnsformRequestPromise);
        }
        return Promise.resolve(res);
      };

      let responseHeaders = {};

      let paramsString = '';
      if (params) {
        paramsString = `?${querystring.stringify(params)}`;
      }
      const finalURL = isMongoRequest
        ? `${this.protocol}://${this.url}`
        : `${this.protocol}://${this.url}/${app}/${path}${paramsString}`;

      return handleTransformRequest(
        Object.assign(
          {},
          {
            url: finalURL,
          },
          requestOptions,
        ),
      )
        .then((ts) => {
          const transformedRequest = Object.assign({}, ts);
          const { url } = transformedRequest;
          delete transformedRequest.url;
          return fetch(
            url || finalURL,
            Object.assign({}, transformedRequest, {
              // apply timestamp header for RS API
              headers:
                isRSAPI && !isMongoRequest
                  ? Object.assign({}, transformedRequest.headers, {
                      'x-timestamp': new Date().getTime(),
                    })
                  : transformedRequest.headers,
            }),
          )
            .then((res) => {
              if (res.status >= 500) {
                return reject(res);
              }
              responseHeaders = res.headers;
              return res
                .json()
                .then((data) => {
                  if (res.status >= 400) {
                    return reject(res);
                  }
                  if (data && data.error) {
                    return reject(data);
                  }
                  // Handle error from RS API RESPONSE
                  if (
                    isRSAPI
                    && data
                    && Object.prototype.toString.call(data) === '[object Object]'
                  ) {
                    if (body && body.query && body.query instanceof Array) {
                      let errorResponses = 0;
                      const allResponses = body.query.filter(
                        q => q.execute || q.execute === undefined,
                      ).length;

                      if (data) {
                        Object.keys(data).forEach((key) => {
                          if (
                            data[key]
                            && Object.prototype.hasOwnProperty.call(
                              data[key],
                              'error',
                            )
                            && !!data[key].error
                          ) {
                            errorResponses += 1;
                          }
                        });
                      }
                      // reject only when all responses has error
                      if (
                        errorResponses > 0
                        && allResponses === errorResponses
                      ) {
                        return reject(data);
                      }
                    }
                  }

                  // Handle error from _msearch response
                  if (data && data.responses instanceof Array) {
                    const allResponses = data.responses.length;
                    const errorResponses = data.responses.filter(entry => Object.prototype.hasOwnProperty.call(entry, 'error')).length;
                    // reject only when all responses has error
                    if (allResponses === errorResponses) {
                      return reject(data);
                    }
                  }
                  const response = Object.assign({}, data, {
                    _timestamp: timestamp,
                    _headers: responseHeaders,
                  });
                  return resolve(response);
                })
                .catch(e => reject(e));
            })
            .catch(e => reject(e));
        })
        .catch(err => reject(err));
    } catch (e) {
      return reject(e);
    }
  });
}
export default fetchRequest;
