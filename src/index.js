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

  AppBaseClient.prototype.performFetchRequest = fetchRequest;

  AppBaseClient.prototype.performWsRequest = wsRequest;

  AppBaseClient.prototype.index = indexApi;

  AppBaseClient.prototype.get = getApi;

  AppBaseClient.prototype.update = updateApi;

  AppBaseClient.prototype.delete = deleteApi;

  AppBaseClient.prototype.bulk = bulkApi;

  AppBaseClient.prototype.search = searchApi;

  AppBaseClient.prototype.msearch = msearchApi;

  AppBaseClient.prototype.getStream = getStreamApi;

  AppBaseClient.prototype.searchStream = searchStreamApi;

  AppBaseClient.prototype.searchStreamToURL = searchStreamToURLApi;

  AppBaseClient.prototype.getTypes = getTypesApi;

  AppBaseClient.prototype.getMappings = getMappingsApi;

  AppBaseClient.prototype.setHeaders = function (headers) {
    this.headers = headers;
  };

  return client;
}
