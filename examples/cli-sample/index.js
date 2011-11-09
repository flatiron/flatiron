console.time('start');
var flatiron = require('../../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.cli, {
  dir: __dirname
});

app.cmd('app start', function () {
  console.timeEnd('start');
  console.dir('it works!!!');
  app.prompt.get('name', function (err, name) {
    console.dir(arguments);
  })
})

app.init(function () {
  app.start();
});
