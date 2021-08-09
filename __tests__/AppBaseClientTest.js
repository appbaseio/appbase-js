const appbase = require('..');

const { uuidv4 } = require('../__mocks__');

describe('#AppBase_Client', () => {
  test('should create appbase client', () => {
    const client = appbase({
      url: 'https://scalr.api.appbase.io',
      app: 'appbasejs-test-app',
      credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
    });
    expect(client).toEqual({
      url: "scalr.api.appbase.io",
      protocol: "https",
      app: "appbasejs-test-app",
      credentials: "zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef",
      headers: {
        "X-Search-Client": "Appbase JS"
      },
    });
  });
  test('should throw url missing error', () => {
    try {
      appbase({
        app: 'appbasejs-test-app',
        credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual('URL not present in options.');
    }
  });
  test('should throw app missing error', () => {
    try {
      appbase({
        url: 'https://scalr.api.appbase.io',
        credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual('App name is not present in options.');
    }
  });
  test('should throw protocol missing error', () => {
    try {
      appbase({
        url: 'scalr.api.appbase.io',
        app: 'appbasejs-test-app',
        credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'Protocol is not present in url. URL should be of the form https://scalr.api.appbase.io',
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
        'Authentication information is not present. Did you add credentials?',
      );
    }
  });
  test('should set headers', () => {
    const client = appbase({
      url: 'https://scalr.api.appbase.io',
      app: 'appbasejs-test-app',
      credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
    });
    client.setHeaders({
      authorization: 'test-authorize',
      'x-search-key': '美女',
    });
    expect(client).toEqual({
      url: 'scalr.api.appbase.io',
      protocol: 'https',
      app: 'appbasejs-test-app',
      credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
      headers: {
        'X-Search-Client': 'Appbase JS',
        authorization: 'test-authorize',
        'x-search-key': '美女',
      },
    });
  });
  test("should set X-Enable-Telemetry header", () => {
    const client = appbase({
      url: "https://scalr.api.appbase.io",
      app: "appbasejs-test-app",
      credentials: "zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef",
      enableTelemetry: false
    });
    expect(client).toEqual({
      url: "scalr.api.appbase.io",
      protocol: "https",
      app: "appbasejs-test-app",
      credentials: "zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef",
      headers: {
        "X-Search-Client": "Appbase JS",
        "X-Enable-Telemetry": false,
      },
    });
  });
  test('should call transformRequest before fetch', async () => {
    const client = appbase({
      url: 'https://scalr.api.appbase.io',
      app: 'appbasejs-test-app',
      credentials: 'zuGt16TPP:1ede0dc2-e727-476e-bc35-ee2956e750ef',
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
