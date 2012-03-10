var flatiron = require('../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http, {
  onError: function (err) {
    this.res.writeHead(err.status || 404, 
      { 'Content-Type': 'application/json' });
    this.res.json(err.body || {"error": "not_found"});
  }});

app.start(8080);

// curl localhost:8080/bla