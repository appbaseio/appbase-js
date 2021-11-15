import URL from 'url-parser-lite';
import { isAppbase } from '../utils/index';
/**
 * Returns an instance of Appbase client
 * @param {Object} config To configure properties
 * @param {String} config.url
 * @param {String} config.app
 * @param {String} config.credentials
 * @param {String} config.username
 * @param {String} config.password
 * @param {Boolean} config.enableTelemetry
 * @param {Object} config.mongodb
 * A callback function which will be invoked before a fetch request made
 */
function AppBase(config) {
  const {
    auth = null,
    host = '',
    path = '',
    protocol = '',
  } = URL(config.url || '');
  let { url } = config;

  // Validate config and throw appropriate error
  if (typeof url !== 'string' || url === '') {
    throw new Error('URL not present in options.');
  }

  if (typeof protocol !== 'string' || protocol === '') {
    throw new Error(
      'Protocol is not present in url. URL should be of the form https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
    );
  }

  let credentials = auth || null;
  if (!config.mongodb) {
    url = host + path;
    // Parse url
    if (url.slice(-1) === '/') {
      url = url.slice(0, -1);
    }
    if (typeof config.app !== 'string' || config.app === '') {
      throw new Error('App name is not present in options.');
    }
    if (isAppbase(url) && credentials === null) {
      throw new Error(
        'Authentication information is not present. Did you add credentials?',
      );
    }
  }
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


  this.mongodb = config.mongodb;
  this.url = url;
  this.protocol = protocol;
  this.app = config.app;
  this.credentials = credentials;
  this.headers = {};
  if (!this.mongodb) {
    this.headers = {
      'X-Search-Client': 'Appbase JS',
    };
  }

  if (typeof config.enableTelemetry === 'boolean') {
    this.enableTelemetry = config.enableTelemetry;
  }
}
export default AppBase;
