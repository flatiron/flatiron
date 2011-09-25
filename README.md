# flatiron

An elegant blend of convention and configuration for building apps in Node.js and the browser

### Middlewares

``` js
var app = require('flatiron').app;

app
  .use(basicAuth)
  .incoming('text/html', 'application/json')
    .use(middleware1)
    .use(middleware2)
  .incoming('application/octet-stream')
    .use(somethingelse)
```