export function contains(string, substring) {
  return string.indexOf(substring) !== -1;
}
export function isAppbase(url) {
  return contains(url, 'scalr.api.appbase.io');
}
export function btoa(input = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const str = input;
  let output = '';

  // eslint-disable-next-line
  for (
    let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || ((map = '='), i % 1); // eslint-disable-line no-bitwise
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8))) // eslint-disable-line no-bitwise
  ) {
    charCode = str.charCodeAt((i += 3 / 4));

    if (charCode > 0xff) {
      throw new Error(
        '"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.',
      );
    }

    block = (block << 8) | charCode; // eslint-disable-line no-bitwise
  }

  return output;
}
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; // eslint-disable-line no-bitwise

    const v = c === 'x' ? r : (r & 0x3) | 0x8; // eslint-disable-line no-bitwise
    return v.toString(16);
  });
}

export function validateRSQuery(query) {
  if (query && Object.prototype.toString.call(query) === '[object Array]') {
    for (let i = 0; i < query.length; i += 1) {
      const q = query[i];
      if (q) {
        if (!q.id) {
          return new Error('\'id\' field must be present in query object');
        }
        if (q.dataField && Object.prototype.toString.call(q.dataField) !== '[object Array]') {
          return new Error('\'dataField\' field must be an array');
        }
      } else {
        return new Error('query object can not have an empty value');
      }
    }
    return true;
  }
  return new Error('invalid query value, \'query\' value must be an array');
}


export function validate(object, fields) {
  const invalid = [];
  const emptyFor = {
    object: null,
    string: '',
  };
  const keys = Object.keys(fields);
  keys.forEach((key) => {
    const type = fields[key];
    // eslint-disable-next-line
    if (typeof object[key] !== type || object[key] === emptyFor[type]) {
      invalid.push(key);
    }
  });
  let missing = '';
  for (let i = 0; i < invalid.length; i += 1) {
    missing += `${invalid[i]}, `;
  }
  if (invalid.length > 0) {
    return new Error(`fields missing: ${missing}`);
  }

  return true;
}

export function removeUndefined(value = {}) {
  if (value || !(Object.keys(value).length === 0 && value.constructor === Object)) {
    return JSON.parse(JSON.stringify(value));
  }
  return null;
}

/**
 * Send only when a connection is opened
 * @param {Object} socket
 * @param {Function} callback
 */
export function waitForSocketConnection(socket, callback) {
  setTimeout(() => {
    if (socket.readyState === 1) {
      if (callback != null) {
        callback();
      }
    } else {
      waitForSocketConnection(socket, callback);
    }
  }, 5); // wait 5 ms for the connection...
}

export function encodeHeaders(headers = {}, shouldEncode = true) {
  // Encode headers
  let encodedHeaders = {};
  if (shouldEncode) {
    Object.keys(headers).forEach((header) => {
      encodedHeaders[header] = encodeURI(headers[header]);
    });
  } else {
    encodedHeaders = headers;
  }
  return encodedHeaders;
}
