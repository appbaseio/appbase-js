import URL from 'url-parser-lite';
import { isAppbase } from '../utils/index';
import betterWs from '../utils/betterWs';
/**
 * Returns an instance of Appbase client
 * @param {Object} config To configure properties
 * @param {String} config.url
 * @param {String} config.appname
 * @param {String} config.credentials
 * @param {String} config.username
 * @param {String} config.password
 * @param {Function} config.beforeSend
 * A callback function which will be invoked before a fetch request made
 */
function AppBase(config) {
  let { url } = config;
  let ws = '';
  const {
 auth = null, host = '', path = '', protocol = '',
} = URL(config.url);

  // Validate config and throw appropriate error
  if (typeof url !== 'string' || url === '') {
    throw new Error('URL not present in options.');
  }
  if (typeof config.appname !== 'string' || config.appname === '') {
    throw new Error('App name is not present in options.');
  }
  if (typeof protocol !== 'string' || protocol === '') {
    throw new Error(
      'Protocol is not present in url. URL should be of the form https://scalr.api.appbase.io',
    );
  }
  // Parse url
  if (url.slice(-1) === '/') {
    url = url.slice(0, -1);
  }
  let credentials = auth || null;
  /**
   * Credentials can be provided as a part of the URL,
   * as username, password args or as a credentials argument directly */
  if (typeof config.credentials === 'string' && config.credentials !== '') {
    // eslint-disable-next-line
    credentials = config.credentials;
  } else if (
    typeof config.username === 'string'
    && config.username !== ''
    && typeof config.password === 'string'
    && config.password !== ''
  ) {
    credentials = `${config.username}:${config.password}`;
  }

  if (isAppbase(url) && credentials === null) {
    throw new Error('Authentication information is not present. Did you add credentials?');
  }

  if (isAppbase(url)) {
    try {
      ws = betterWs(`wss://${config.url}/${config.appname}`);
    } catch (e) {
      console.error(e);
    }
  }
  this.url = host + path;
  this.protocol = protocol;
  this.appname = config.appname;
  this.beforeSend = config.beforeSend;
  this.credentials = credentials;
  this.headers = {};
  this.ws = ws;
  this.setHeaders = (headers) => {
    this.headers = headers;
  };
}
export default AppBase;
