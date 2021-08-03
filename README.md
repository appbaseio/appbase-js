![Build Status Image](https://img.shields.io/badge/build-passing-brightgreen.svg)

# appbase-js

Appbase.io is a data streams library for Node.JS and Javascript (browser UMD build is in the [dist/](https://github.com/appbaseio/appbase-js/tree/master/dist) directory); compatible with [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html).

An up-to-date documentation for Node.JS API is available at http://docs.appbase.io/javascript/quickstart.html.

## Quick Example

Working code snippets where each step builds on the previous ones.

#### Step 1: Add some data into the app (uses elasticsearch.js)

```js
// app and authentication configurations
const HOST_URL = "https://scalr.api.appbase.io";
const APPNAME = "createnewtestapp01";
const CREDENTIALS = "RIvfxo1u1:dee8ee52-8b75-4b5b-be4f-9df3c364f59f";

// Add data into our ES "app index"
var Appbase = require("appbase-js");
var appbase = Appbase({
  url: HOST_URL,
  app: APPNAME,
  credentials: CREDENTIALS,
});
appbase
  .index({
    type: "product",
    id: "1",
    body: {
      name: "A green door",
      price: 12.5,
      tags: ["home", "green"],
      stores: ["Walmart", "Target"],
    },
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

#### Step 2: Read the data stream from a particular DB location

Returns continous updates on a JSON document from a particular `type`.

```js
appbase.getStream(
  {
    type: "product",
    id: "1",
  },
  (data) => {
    // "data" handler is triggered every time there is a **new** document update.
    console.log(data);
  },
  (error) => {
    console.log("caught a stream error", error);
  }
);
```

`Note:` Existing document value is returned via `get()` method.

##### Console Output

```js
{
  _index: "app`248",
  _type: "product",
  _id: "1",
  _version: 4,
  found: true,
  _source: {
    name: "A green door",
    price: 12.5,
    tags: [ "home", "green" ],
    stores: [ "Walmart", "Target" ]
  }
}
```

getStream() returns an object which has `stop` & `reconnect` properties. Check out the [getStreamTest.js](https://github.com/bietkul/appbase-js/blob/develop/__tests__/getStream.js) where we make an update to the document and see any further updates to it via the "data" callback.

#### Step 3: Apply queries on data streams

Get continuous results by searching across the database streams. A query can be written using the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) - which supports composing boolean, regex, geo, fuzzy, range queries. Let's stream the results of a simple **`match_all`** query on the `product` type:

```js
appbase.searchStream(
  {
    type: "product",
    body: {
      query: {
        match_all: {},
      },
    },
  },
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log("caught a stream error", error);
  }
);
```

##### Console Output

```js
{
  took: 1,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    failed: 0
  },
  hits: {
    total: 4,
    max_score: 1,
    hits: [ [Object], [Object], [Object], [Object] ]
  }
}
```

searchStream() also returns an object, which can be conveniently listened via the `onData` callback. Check out the [searchStreamTest.js](https://github.com/bietkul/appbase-js/blob/develop/__tests__/searchStreamTest.js) where we make an update that matches the query and see the results in the event stream.

## API Reference

For a complete API reference, check out [JS API Ref doc](http://docs.appbase.io/javascript/api-reference.html).

### Global

**[Appbase(args)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L16)**

Returns a **reference** object on which streaming requests can be performed.

> **args** - A set of key/value pairs that configures the ElasticSearch Index
> &nbsp;&nbsp;&nbsp;&nbsp;url: "https://scalr.api.appbase.io" > &nbsp;&nbsp;&nbsp;&nbsp;app: App name (equivalent to an ElasticSearch Index)
> &nbsp;&nbsp;&nbsp;&nbsp;credentials: A `username:password` combination used for Basic Auth.

Optionally (and like in the quick example above), `url` can contain the credentials field in the format: https://&lt;credentials>@scalr.appbase.io.

### Reference

**[reference.getStream(args, onData, onError, onClose)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L99)**

Get continuous updates on a JSON document with a `type` and `id`.Returns an object.

> **args** - A set of key/value pairs that makes the document URL
> &nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type, a string
> &nbsp;&nbsp;&nbsp;&nbsp;id: Valid Document ID

**[reference.searchStream(args, onData, onError, onClose)](https://github.com/appbaseio/appbase-js/blob/master/appbase.js#L103)**

Get continuous updates on search queries (fuzzy, boolean, geolocation, range, full-text).Returns an object.

> **args** - A set of key/value pairs that makes the document URL
> &nbsp;&nbsp;&nbsp;&nbsp;type: ElasticSearch Type, a string
> &nbsp;&nbsp;&nbsp;&nbsp;body: A JSON Query Body (Any query matching the [ElasticSearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html))
