var flatiron = require('../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http, 
  { before: [ function(req, res) { 
    console.log(
      {"method": req.method, "url": req.url, "date": Date.now()});
    res.emit("next"); } ] 
  });

app.router.get('/', function () {
  this.res.json({});
});

app.start(8080);

// curl localhost:8080