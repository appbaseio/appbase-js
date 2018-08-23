const appbase = require('..');
const config = require('../__mocks__/defaultConfig');

describe('#Get_Types', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test('should receive an array of types', async done => {
    const types = await client.getTypes();
    if (types && types instanceof Array) {
      if (types.length > 0) {
        done();
      } else {
        done(new Error('No type is present in the array.'));
      }
    } else {
      done(new Error('The object received is not an array.'));
    }
  });
});
