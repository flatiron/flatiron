var flatiron = require('../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http);

function nodejitsuOnly(req,res) {
  res.emit("next");
}

app.router.get('/:user', /*{before: nodejitsuOnly},*/ function () {
  this.res.json({ok:true});
});

app.start(8080);

// curl localhost:8080