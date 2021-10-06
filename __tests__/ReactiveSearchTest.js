const appbase = require("../dist");
const { uuidv4 } = require("../__mocks__");
const config = require("../__mocks__/defaultConfig");

describe("#Search", function () {
  let client;
  beforeAll(() => {
    client = appbase({
      url: config.URL,
      app: config.APPNAME,
      credentials: config.CREDENTIALS,
    });
  });

  test("should return results", async () => {
    var tweet = {
      user: "olivere",
      message: "Welcome to Golang and Elasticsearch.",
    };
    await client.index({
      id: uuidv4(),
      body: tweet,
    });
    const res = await client.reactiveSearch([
      {
        id: "tweet_search",
        dataField: ["user"],
        size: 10,
        value: "olivere",
      },
    ]);
    expect(res.tweet_search.hits.total.value).toBeGreaterThan(0);
  });
  test("Elastic error", async () => {
    try {
      const res = await client.reactiveSearch([
        {
          id: "tweet_search",
          dataField: ["user"],
          type: "term",
          size: 10,
        },
      ]);
    } catch (e) {
      expect(e.tweet_search.status).toEqual(400);
    }
  });
});
