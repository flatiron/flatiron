# [flatiron](http://flatironjs.org) [![Build Status](https://secure.travis-ci.org/flatiron/flatiron.png)](http://travis-ci.org/flatiron/flatiron)

*An elegant blend of convention and configuration for building apps in Node.js and the browser*

![](http://flatironjs.org/img/flatiron.png)

# Example http server:

```js
var flatiron = require('flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.end('Hello world!\n');
});

app.start(8080);
```

# Example cli application:

```js
// example.js

var flatiron = require('flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.cli, {
  dir: __dirname,
  usage: [
    'This is a basic flatiron cli application example!',
    '',
    'hello - say hello to somebody.'
  ]
});

app.cmd('hello', function () {
  app.prompt.get('name', function (err, result) {
    app.log.info('hello '+result.name+'!');
  })
})

app.start();
```

## Run it:

```
% node example.js hello
prompt: name: world
info:   hello world!
```

## Installation

### Installing npm (node package manager)
```
  curl http://npmjs.org/install.sh | sh
```

### Installing flatiron
```
  [sudo] npm install flatiron
```

### Installing union (required for `flatiron.plugins.http`)
```
  npm install union
```

# Usage:

## `flatiron.app`

`flatiron.app` is a [broadway injection container](https://github.com/flatiron/broadway). To be brief, what it does is allow plugins to modify the `app` object directly:

```js
var flatiron = require('flatiron'),
    app = require('app');

var hello = {
  attach: function (options) {
    this.hello = options.message || 'Why hello!';
  }
};

app.use(hello, {
  message: "Hi! How are you?"
});

// Will print, "Hi! How are you?"
console.log(app.hello);
```

Virtually all additional functionality in flatiron comes from broadway plugins, such as `flatiron.plugins.http` and `flatiron.plugins.cli`.

`flatiron.app` comes with a [`config`](https://github.com/flatiron/broadway/blob/master/lib/broadway/plugins/config.js) plugin pre-loaded, which adds configuration management courtesy [nconf](https://github.com/flatiron/nconf).

## `flatiron.plugins.http(options)`

This plugin adds http serving functionality to your flatiron app by attaching the following properties and methods:

### `app.server`

This is a [union](https://github.com/flatiron/union) middleware kernel.

### `app.http`

This object contains options that are passed to the union server, including `app.http.before`, `app.http.after` and `app.http.headers`.

These properties may be set by passing them through as options:

```js
app.use(flatiron.plugins.http, {
  before: [],
  after: []
});
```

You can read more about these options on the [union project page](https://github.com/flatiron/union#readme).

### `app.router`

This is a [director](https://github.com/flatiron/director) router configured to route http requests after the middlewares in `app.http.before` are applied. Example routes include:

```js

// GET /
app.router.get('/', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.end('Hello world!\n');
});

// POST to /
app.router.post('/', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.write('Hey, you posted some cool data!\n');
  this.res.end(util.inspect(this.req.body, true, 2, true) + '\n');
});

// Parameterized routes
app.router.get('/sandwich/:type', function (type) {
  if (~['bacon', 'burger'].indexOf(type)) {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' });
    this.res.end('Serving ' + type + ' sandwich!\n');
  }
  else {
    this.res.writeHead(404, { 'Content-Type': 'text/plain' });
    this.res.end('No such sandwich, sorry!\n');
  }
});
```

`app.router` can also route against regular expressions and more! To learn more about director's advanced functionality, visit director's [project page](https://github.com/flatiron/director#readme).

## `app.start(<host>, port, <callback(err)>)`

This method will both call `app.init` (which will call any asynchronous initialization steps on loaded plugins) and start the http server with the given arguments. For example, the following will start your flatiron http server on port 8080:

```js
app.start(8080);
```

## `flatiron.plugins.cli(options)`

This plugin turns your app into a cli application framework. For example, [jitsu]
(https://github.com/nodejitsu/jitsu) uses flatiron and the cli plugin.

**More documentation coming soon!**

# Read More About Flatiron!

## Articles

* [Scaling Isomorphic Javascript Code](http://blog.nodejitsu.com/scaling-isomorphic-javascript-code)
* [Introducing Flatiron](http://blog.nodejitsu.com/introducing-flatiron)

## Sub-projects

* [Broadway](https://github.com/flatiron/broadway)
* [Union](https://github.com/flatiron/union)
* [Director](https://github.com/flatiron/director)
* [Plates](https://github.com/flatiron/plates)
* [Resourceful](https://github.com/flatiron/resourceful)
* [And More](https://github.com/flatiron)!

# Tests

Tests are written in vows:

``` bash
  $ npm test
```

#### Author: [Nodejitsu Inc.](http://nodejitsu.com)
#### License: MIT
