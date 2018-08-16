export function validate(object, fields) {
  const invalid = [];
  const keys = Object.keys(fields);

  // eslint-disable-next-line
  for (const key of keys) {
    const type = fields[key];
    // eslint-disable-next-line
    if (typeof object[key] !== type || object[key] === empty_for[type]) {
      invalid.push(key);
    }
  }

  let missing = '';
  for (let i = 0; i < invalid.length; i += 1) {
    missing += `${invalid[i]}, `;
  }
  if (invalid.length > 0) {
    return new Error(`fields missing: ${missing}`);
  }

  return true;
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
function contains(string, substring) {
  return string.indexOf(substring) !== -1;
}
export function isAppbase(client) {
  return contains(client.url, 'scalr.api.appbase.io');
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; // eslint-disable-line no-bitwise

    const v = c === 'x' ? r : (r & 0x3) | 0x8; // eslint-disable-line no-bitwise
    return v.toString(16);
  });
}
