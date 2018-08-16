import URL from 'url-parser-lite';
import FetchRequest from './fetch_request';
import BetterWS from './better_websocket';
import WsRequest from './websocket_request';
import IndexService from './actions/index';
import GetService from './actions/get';
import UpdateService from './actions/update';
import DeleteService from './actions/delete';
import BulkService from './actions/bulk';
import SearchService from './actions/search';
import MsearchService from './actions/msearch';
import GetTypesService from './actions/get_types';
import GetMappingsService from './actions/get_mappings';
import AddWebhookService from './actions/webhook';
import StreamDocumentService from './actions/stream_document';
import StreamSearchService from './actions/stream_search';
import { isAppbase } from './helpers';

class AppbaseClient {
  constructor(args) {
    if (typeof args.url !== 'string' || args.url === '') {
      throw new Error('URL not present in options.');
    }

    const {
 auth = null, host = '', path = '', protocol = '',
} = URL(args.url);

    this.url = host + path;
    this.protocol = protocol;
    this.credentials = auth || null;
    this.appname = args.appname || args.app;
    this.headers = {};
    this.beforeSend = args.beforeSend;

    if (typeof this.appname !== 'string' || this.appname === '') {
      throw new Error('App name is not present in options.');
    }

    if (typeof this.protocol !== 'string' || this.protocol === '') {
      throw new Error(
        'Protocol is not present in url. URL should be of the form https://scalr.api.appbase.io',
      );
    }

    // credentials can be provided as a part of the URL, as username, password args or
    // as a credentials argument directly
    if (typeof args.credentials === 'string' && args.credentials !== '') {
      this.credentials = args.credentials;
    } else if (
      typeof args.username === 'string'
      && args.username !== ''
      && typeof args.password === 'string'
      && args.password !== ''
    ) {
      this.credentials = `${args.username}:${args.password}`;
    }

    if (isAppbase(this) && this.credentials === null) {
      throw new Error('Authentication information is not present. Did you add credentials?');
    }

    if (isAppbase(this)) {
      try {
        this.ws = new BetterWS(`wss://${this.url}/${this.appname}`);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.url.slice(-1) === '/') {
      this.url = this.url.slice(0, -1);
    }

    return this;
  }

  setHeaders(headers) {
    this.headers = headers;
  }

  performWsRequest(args) {
    return new WsRequest(this, JSON.parse(JSON.stringify(args)));
  }

  performStreamingRequest(args) {
    return new WsRequest(this, JSON.parse(JSON.stringify(args)));
  }

  performFetchRequest(args) {
    return new FetchRequest(this, JSON.parse(JSON.stringify(args)));
  }

  index(args) {
    return new IndexService(this, JSON.parse(JSON.stringify(args)));
  }

  get(args) {
    return new GetService(this, JSON.parse(JSON.stringify(args)));
  }

  update(args) {
    return new UpdateService(this, JSON.parse(JSON.stringify(args)));
  }

  delete(args) {
    return new DeleteService(this, JSON.parse(JSON.stringify(args)));
  }

  bulk(args) {
    return new BulkService(this, JSON.parse(JSON.stringify(args)));
  }

  search(args) {
    return new SearchService(this, JSON.parse(JSON.stringify(args)));
  }

  msearch(args) {
    return new MsearchService(this, JSON.parse(JSON.stringify(args)));
  }

  getStream(args) {
    return new StreamDocumentService(this, JSON.parse(JSON.stringify(args)));
  }

  searchStream(args) {
    return new StreamSearchService(this, JSON.parse(JSON.stringify(args)));
  }

  searchStreamToURL(args, webhook) {
    return new AddWebhookService(
      this,
      JSON.parse(JSON.stringify(args)),
      JSON.parse(JSON.stringify(webhook)),
    );
  }

  getTypes() {
    return new GetTypesService(this);
  }

  getMappings() {
    return new GetMappingsService(this);
  }
}

if (typeof window !== 'undefined') {
  window.Appbase = AppbaseClient;
}

export default AppbaseClient;
