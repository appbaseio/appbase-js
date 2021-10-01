## ![Build Status Image](https://img.shields.io/badge/build-passing-brightgreen.svg)

<h2 id="top" align="center">
  <img src="https://i.imgur.com/iiR9wAs.png" alt="appbase-js" title="appbase-js" width="200" />
  <br />
  appbase-js
  <br />
</h2>

[appbase-js](https://github.com/appbaseio/appbase-js) is a universal JavaScript client library for working with the appbase.io database, for Node.JS and Javascript (browser UMD build is in the [dist/](https://github.com/appbaseio/appbase-js/tree/master/dist) directory); compatible with [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html).

An up-to-date documentation for Node.JS API is available at http://docs.appbase.io/javascript/quickstart.html.

## TOC

1. **[appbase-js: Intro](#1-appbase-js-intro)**
2. **[Features](#2-features)**
3. **[Live Examples](#3-live-examples)**
4. **[Installation](#4-installation)**
5. **[Docs Manual](#5-docs-manual)**
6. **[Other Projects You Might Like](#6-other-projects-you-might-like)**

<br />
## 1. appbase-js: Intro

[appbase-js](https://github.com/appbaseio/appbase-js) is a universal JavaScript client library for working with the appbase.io database.

## 2. Features

It can:

- Index new documents or update / delete existing ones.
- Work universally with Node.JS, Browser, and React Native.

It can't:

- Configure mappings, change analyzers, or capture snapshots. All these are provided by [elasticsearch.js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html) - the official Elasticsearch JS client library.

[Appbase.io - the database service](https://appbase.io) is opinionated about cluster setup and hence doesn't support the Elasticsearch devops APIs. See [rest.appbase.io](https://rest.appbase.io) for a full reference on the supported APIs.

## 3. Live Examples

<br />
<p>Check out the Live interactive Examples at <a href="
https://docs.appbase.io/api/examples/rest/" target="_blank">reactiveapps.io</a>.</p>
<br/>

[![image](https://user-images.githubusercontent.com/57627350/128456523-7c964efc-8940-43bc-b3b5-142fc40bdf11.png)](https://docs.appbase.io/api/examples/rest/)

## 4. Installation

We will fetch and install the **appbase-js** lib using npm. `4.0.0-beta` is the most current version.

```js
npm install appbase-js
```

Adding it in the browser should be a one line script addition.

```html
<script
  defer
  src="https://unpkg.com/appbase-js/dist/appbase-js.umd.min.js"
></script>
```

Alternatively, a UMD build of the library can be used directly from [jsDelivr](https://cdn.jsdelivr.net/npm/appbase-js/dist/).

To write data to [appbase.io](https://appbase.io), we need to first create a reference object. We do this by passing the appbase.io API URL, app name, and credentials into the `Appbase` constructor:

```js
var appbaseRef = Appbase({
  url: "https://appbase-demo-ansible-abxiydt-arc.searchbase.io",
  app: "good-books-demo",
  credentials: "c84fb24cbe08:db2a25b5-1267-404f-b8e6-cf0754953c68",
});
```

**OR**

```js
var appbaseRef = Appbase({
  url: "https://c84fb24cbe08:db2a25b5-1267-404f-b8e6-cf0754953c68@appbase-demo-ansible-abxiydt-arc.searchbase.io",
  app: "good-books-demo",
});
```

Credentials can also be directly passed as a part of the API URL.

## 5. Docs Manual

For a complete API reference, check out [JS API Ref doc](http://docs.appbase.io/javascript/api-reference.html).

## 6. Other Projects You Might Like

- [**arc**](https://github.com/appbaseio/arc) API Gateway for ElasticSearch (Out of the box Security, Rate Limit Features, Record Analytics and Request Logs).

- [**searchbox**](https://github.com/appbaseio/searchox) A lightweight and performance focused searchbox UI libraries to query and display results from your ElasticSearch app (aka index).

  - **Vanilla JS** - (~16kB Minified + Gzipped)
  - **React** - (~30kB Minified + Gzipped)
  - **Vue** - (~22kB Minified + Gzipped)

- [**dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

- [**mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

- [**ReactiveMaps**](https://github.com/appbaseio/reactivesearch/tree/next/packages/maps) is a similar project to Reactive Search that allows building realtime maps easily.

- [**reactivesearch**](https://github.com/appbaseio/reactivesearch) UI components library for Elasticsearch: Available for React and Vue.

[⬆ Back to Top](#top)

<a href="https://appbase.io/support/"><img src="https://i.imgur.com/UL6B0uE.png" width="100%" /></a>
