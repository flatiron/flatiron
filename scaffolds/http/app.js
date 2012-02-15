var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.resourceful, { dir: path.join(__dirname, 'app', 'resources') });
app.use(flatiron.plugins.plates, { dir: path.join(__dirname, 'app', 'views') });
app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.json({ 'hello': 'world' })
});

app.start(3000);
