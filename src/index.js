import AppBaseClient from './core/index';
import fetchRequest from './core/request/fetch';
import indexApi from './core/api/index';
import getApi from './core/api/get';
import updateApi from './core/api/update';
import deleteApi from './core/api/delete';
import bulkApi from './core/api/bulk';
import searchApi from './core/api/search';
import msearchApi from './core/api/msearch';
import reactiveSearchv3Api from './core/api/reactiveSearchv3Api';
import getTypesApi from './core/api/getTypes';
import getMappingsApi from './core/api/getMappings';
import { encodeHeaders } from './utils/index';
import getSuggestionsv3Api from './core/api/getSuggestionsv3Api';

export default function (config) {
	const client = new AppBaseClient(config);

	AppBaseClient.prototype.performFetchRequest = fetchRequest;

	AppBaseClient.prototype.index = indexApi;

	AppBaseClient.prototype.get = getApi;

	AppBaseClient.prototype.update = updateApi;

	AppBaseClient.prototype.delete = deleteApi;

	AppBaseClient.prototype.bulk = bulkApi;

	AppBaseClient.prototype.search = searchApi;

	AppBaseClient.prototype.msearch = msearchApi;

	AppBaseClient.prototype.reactiveSearchv3 = reactiveSearchv3Api;

	AppBaseClient.prototype.getQuerySuggestions = getSuggestionsv3Api;

	AppBaseClient.prototype.getTypes = getTypesApi;

	AppBaseClient.prototype.getMappings = getMappingsApi;

	AppBaseClient.prototype.setHeaders = function setHeaders(headers = {}, shouldEncode = false) {
		// Encode headers
		if (shouldEncode) {
			this.headers = encodeHeaders(headers);
		} else {
			this.headers = headers;
		}
	};

	if (typeof window !== 'undefined') {
		window.Appbase = client;
	}
	return client;
}
