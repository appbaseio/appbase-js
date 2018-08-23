const appbase = require('..');
const config = require('../__mocks__/defaultConfig');

describe('#Get_Mappings', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should get mappings object', async done => {
    const mappings = await client.getMappings();
    if (mappings[client.app].mappings) {
      done();
    } else {
      done(new Error('Mappings are not present'));
    }
  });
});
