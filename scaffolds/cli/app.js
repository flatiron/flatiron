var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

app.use(flatiron.plugins.cli, {
  source: path.join(__dirname, 'lib', 'commands'),
  usage: 'Empty Flatiron Application, please fill out commands'
});

app.start();
