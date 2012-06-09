var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

app.root = __dirname;
app.env = process.env.NODE_ENV || 'development';

app.config.file({ file: path.join(app.root, 'config', 'env', app.env + '.json') });

app.use(flatiron.plugins.http);
app.use(flatiron.plugins.resourceful);

app.router.get('/', function () {
  this.res.json({ 'hello': 'world' })
});

app.start(3000);
