import AppBaseClient from './core/index';
import fetchRequest from './core/request/fetch';
import indexApi from './core/api/index';
import getApi from './core/api/get';
import updateApi from './core/api/update';
import deleteApi from './core/api/delete';
import bulkApi from './core/api/bulk';
import searchApi from './core/api/search';
import msearchApi from './core/api/msearch';
import reactiveSearchApi from './core/api/reactiveSearchApi';
import getMappingsApi from './core/api/getMappings';
import { encodeHeaders } from './utils/index';

export default function appbasejs(config) {
  const client = new AppBaseClient(config);

  AppBaseClient.prototype.performFetchRequest = fetchRequest;

  AppBaseClient.prototype.index = indexApi;

  AppBaseClient.prototype.get = getApi;

  AppBaseClient.prototype.update = updateApi;

  AppBaseClient.prototype.delete = deleteApi;

  AppBaseClient.prototype.bulk = bulkApi;

  AppBaseClient.prototype.search = searchApi;

  AppBaseClient.prototype.msearch = msearchApi;

  AppBaseClient.prototype.reactiveSearch = reactiveSearchApi;

  AppBaseClient.prototype.reactiveSearchv3 = reactiveSearchApi;

  AppBaseClient.prototype.getMappings = getMappingsApi;

  AppBaseClient.prototype.setHeaders = function setHeaders(
    headers = {},
    shouldEncode = false,
  ) {
    // Encode headers
    if (shouldEncode) {
      Object.assign(this.headers, encodeHeaders(headers));
    } else {
      Object.assign(this.headers, headers);
    }
  };

  if (typeof window !== 'undefined') {
    window.Appbase = client;
  }
  return client;
}
