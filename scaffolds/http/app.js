var flatiron = require('flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http);
app.router.get('/', function () {
  this.res.json({ 'hello': 'world' })
});

app.start(3000);
