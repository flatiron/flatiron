var flatiron = require('../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http);

// doesnt work
app.router.notfound = function (req,res) {
  res.write("404");
  res.end();
};

app.start(8080);

// curl localhost:8080/bla