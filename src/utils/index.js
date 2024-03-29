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
          return new Error("'id' field must be present in query object");
        }
      } else {
        return new Error('query object can not have an empty value');
      }
    }
    return true;
  }
  return new Error("invalid query value, 'query' value must be an array");
}

export function validate(object, fields) {
  const invalid = [];
  const emptyFor = {
    object: null,
    string: '',
    number: 0,
  };
  const keys = Object.keys(fields);
  keys.forEach((key) => {
    const types = fields[key].split('|');
    const matchedType = types.find(
      type =>
        // eslint-disable-next-line
        typeof object[key] === type
    );
    if (!matchedType || object[key] === emptyFor[matchedType]) {
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
  if (
    value
    || !(Object.keys(value).length === 0 && value.constructor === Object)
  ) {
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
export function getMongoRequest(app, mongo) {
    const mongodb = {};
    if (app) {
      mongodb.index = app;
    }
    if (mongo) {
      if (mongo.db) {
        mongodb.db = mongo.db;
      }
      if (mongo.collection) {
        mongodb.collection = mongo.collection;
      }
    }
    return mongodb;
  }

export function getTelemetryHeaders(enableTelemetry, shouldSetHeaders) {
  const headers = {};
  if (!shouldSetHeaders) {
    return headers;
  }
    Object.assign(headers, {
      'X-Search-Client': 'Appbase JS',
    });

  if (enableTelemetry === false) {
    Object.assign(headers, {
      'X-Enable-Telemetry': enableTelemetry,
    });
  }

  return headers;
}


export const backendAlias = {
  MONGODB: 'mongodb', // mongodb
  ELASTICSEARCH: 'elasticsearch', // elasticsearch
};
export const dataTypes = {
  ARRAY: 'array',
  FUNCTION: 'function',
  OBJECT: 'object',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  STRING: 'string',
};
const checkDataType = (temp) => {
  // eslint-disable-next-line
  if (typeof temp === dataTypes.OBJECT) {
    if (Array.isArray(temp)) {
      return dataTypes.ARRAY;
    }

    return dataTypes.OBJECT;
  }
  return typeof temp;
};

export function validateSchema(
  passedProperties = {},
  schema = {},
  backendName = '',
) {
  const passedPropertiesKeys = Object.keys(passedProperties).filter(
    propertyKey => !!passedProperties[propertyKey],
  );
  const acceptedProperties = Object.keys(schema);
  const requiredProperties = [];
  // fetch required properties
  acceptedProperties.forEach((propName) => {
    const currentProperty = schema[propName];
      if (currentProperty.required) {
        requiredProperties.push(propName);
      }
  });
  // check for required properties
  requiredProperties.forEach((requiredProperty) => {
    if (!passedPropertiesKeys.includes(requiredProperty)) {
      throw new Error(
        `${requiredProperty} is required when using the ${backendName} Search backend.`,
      );
    }
  });

  // check for accepted properties
  passedPropertiesKeys.forEach((passedPropertyKey) => {
    if (!acceptedProperties.includes(passedPropertyKey)) {
      throw new Error(
        `${passedPropertyKey} property isn't accepted property by ${backendName} backend.`,
      );
    }

    const acceptedTypes = Array.isArray(schema[passedPropertyKey].type)
      ? schema[passedPropertyKey].type
      : [...schema[passedPropertyKey].type];
    const receivedPropertyType = checkDataType(
      passedProperties[passedPropertyKey],
    );
    if (!acceptedTypes.includes(receivedPropertyType)) {
      throw new Error(
        `The property ${passedPropertyKey} is expected with type(s) [${acceptedTypes.join(
          ', ',
        )}], but type was set as ${receivedPropertyType}.`,
      );
    }
  });
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
