const appbase = require('..');

const { uuidv4 } = require('../__mocks__');

describe('#AppBase_Client', () => {
  test('should create appbase client', () => {
    const client = appbase({
      url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
      app: 'appbasejs-test-app',
      credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
    });
    expect(client).toEqual({
      url: 'appbase-demo-ansible-abxiydt-arc.searchbase.io',
      protocol: 'https',
      app: 'appbasejs-test-app',
      credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
    });
  });
  test('should throw url missing error', () => {
    try {
      appbase({
        app: 'appbasejs-test-app',
        credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual('URL not present in options.');
    }
  });
  test('should throw app missing error', () => {
    try {
      appbase({
        url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
        credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual('App name is not present in options.');
    }
  });
  test('should throw protocol missing error', () => {
    try {
      appbase({
        url: 'appbase-demo-ansible-abxiydt-arc.searchbase.io',
        app: 'appbasejs-test-app',
        credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'Protocol is not present in url. URL should be of the form https://appbase-demo-ansible-abxiydt-arc.searchbase.io'
      );
    }
  });
  test('should throw credentials missing error', () => {
    try {
      appbase({
        url: 'https://scalr.api.appbase.io',
        app: 'appbasejs-test-app',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'Authentication information is not present. Did you add credentials?'
      );
    }
  });
  test('should set headers', () => {
    const client = appbase({
      url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
      app: 'appbasejs-test-app',
      credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
    });
    client.setHeaders({
      authorization: 'test-authorize',
      'x-search-key': '美女',
    });
    expect(client).toEqual({
      url: 'appbase-demo-ansible-abxiydt-arc.searchbase.io',
      protocol: 'https',
      app: 'appbasejs-test-app',
      credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
      headers: {
        authorization: 'test-authorize',
        'x-search-key': '美女',
      },
    });
  });
  test('should set X-Enable-Telemetry header', () => {
    const client = appbase({
      url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
      app: 'appbasejs-test-app',
      credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
      enableTelemetry: false,
    });
    expect(client).toEqual({
      url: "appbase-demo-ansible-abxiydt-arc.searchbase.io",
      protocol: "https",
      app: "appbasejs-test-app",
      credentials: "f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f",
      enableTelemetry: false,
    });
  });
  test('should call transformRequest before fetch', async () => {
    const client = appbase({
      url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
      app: 'appbasejs-test-app',
      credentials: 'f1a7b4562098:35fed6ff-4a19-4387-a188-7cdfe759c40f',
    });
    client.transformRequest = (request) => {
      expect(true).toBe(true);
      return request;
    };
    const id = uuidv4();
    const tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    client.index({
      type: 'tweet_transform_error',
      id,
      body: tweet,
    });
  });
});
