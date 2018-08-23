const appbase = require('..');
const { uuidv4 } = require('../__mocks__');
const config = require('../__mocks__/defaultConfig');

describe('#Search_stream', function() {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });
  test('should receive event when new document is inserted', async function(done) {
    const tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    const id = uuidv4();
    let first = true;
    const indexFunc = async function() {
      await client.index({
        type: 'tweet_search_stream',
        id,
        body: tweet,
      });
    };
    const responseStream = client.searchStream(
      {
        type: 'tweet_search_stream',
        body: {
          query: {
            match_all: {},
          },
        },
      },
      async res => {
        if (first) {
          await indexFunc();
          first = false;
        } else {
          try {
            expect(res).toEqual({
              _type: 'tweet_search_stream',
              _id: id,
              _source: tweet,
            });
          } catch (e) {
            responseStream.stop();
            return done(e);
          }
          responseStream.stop();
          done();
        }
      },
      err => {
        if (err) {
          done(err);
          return;
        }
      },
    );
    setTimeout(indexFunc, 100);
  });

  test('should receive event when new document is inserted while querying multiple types', async function(done) {
    const tweet = {
      user: 'olivere',
      message: 'Welcome to Golang and Elasticsearch.',
    };
    const id = uuidv4();
    await client.index({
      type: 'tweet_search_stream',
      id,
      body: tweet,
    });

    let first = true;
    const responseStream = client.searchStream(
      {
        type: ['tweet_search_stream', 'tweet2'],
        body: {
          query: {
            match_all: {},
          },
        },
      },
      async res => {
        if (first) {
          await client.index({
            type: 'tweet_search_stream',
            id,
            body: tweet,
          });

          first = false;
        } else {
          try {
            expect(res).toEqual({
              _type: 'tweet_search_stream',
              _id: id,
              _source: tweet,
            });
          } catch (e) {
            responseStream.stop();
            return done(e);
          }
          responseStream.stop();
          done();
        }
      },
      err => {
        if (err) {
          done(err);
          return;
        }
      },
    );

    setTimeout(async function() {
      await client.index({
        type: 'tweet_search_stream',
        id,
        body: tweet,
      });
    }, 2000);
  });
});
