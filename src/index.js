import AppBaseClient from './core/index';
import fetchRequest from './core/request/fetch';
import wsRequest from './core/request/ws';
import indexApi from './core/api/index';
import getApi from './core/api/get';
import updateApi from './core/api/update';
import deleteApi from './core/api/delete';
import bulkApi from './core/api/bulk';
import searchApi from './core/api/search';
import msearchApi from './core/api/msearch';
import getStreamApi from './core/api/getStream';
import searchStreamApi from './core/api/searchStream';
import searchStreamToURLApi from './core/api/searchStreamToURL';
import getTypesApi from './core/api/getTypes';
import getMappingsApi from './core/api/getMappings';

export default function (config) {
  const client = new AppBaseClient(config);

  client.prototype.performFetchRequest = fetchRequest;

  client.prototype.performWsRequest = wsRequest;

  client.prototype.index = indexApi;

  client.prototype.get = getApi;

  client.prototype.update = updateApi;

  client.prototype.delete = deleteApi;

  client.prototype.bulk = bulkApi;

  client.prototype.search = searchApi;

  client.prototype.msearch = msearchApi;

  client.prototype.getStream = getStreamApi;

  client.prototype.searchStream = searchStreamApi;

  client.prototype.searchStreamToURL = searchStreamToURLApi;

  client.prototype.getTypes = getTypesApi;

  client.prototype.getMappings = getMappingsApi;

  return client;
}
