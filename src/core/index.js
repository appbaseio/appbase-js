import URL from 'url-parser-lite';
import { backendAlias, isAppbase, validateSchema } from '../utils/index';
import SCHEMA from '../utils/schema/index';
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
  url = host + path;
  // Parse url
  if (url.slice(-1) === '/') {
    url = url.slice(0, -1);
  }
  const backendName = backendAlias[config.mongodb ? 'MONGODB' : 'ELASTICSEARCH'];
  // eslint-disable-next-line
  const schema = SCHEMA[backendName];
  validateSchema(
    {
      url: config.url,
      app: config.app,
      credentials: config.credentials,
      username: config.username,
      password: config.password,
      enableTelemetry: config.enableTelemetry,
      mongodb: config.mongodb,
    },
    schema,
    backendName,
  );

  if (typeof protocol !== 'string' || protocol === '') {
    throw new Error(
      'Protocol is not present in url. URL should be of the form https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
    );
  }

  let credentials = auth || null;
  if (!config.mongodb) {
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

  this.url = url;
  this.protocol = protocol;
  this.app = config.app;
  this.credentials = credentials;
  if (config.mongodb) {
    this.mongodb = config.mongodb;
  }

  if (typeof config.enableTelemetry === 'boolean') {
    this.enableTelemetry = config.enableTelemetry;
  }
}
export default AppBase;
