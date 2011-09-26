var flatiron = require('../../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.cli, {});

app.init(function () {
  console.dir(app.argv)
});
