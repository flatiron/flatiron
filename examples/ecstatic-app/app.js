
var flatiron = require('../../lib/flatiron'),
    app = flatiron.app;

app.use(flatiron.plugins.http);
app.use(flatiron.plugins.ecstatic, {
  root: __dirname,
  autoIndex: true
});

app.router.get('/headers', function () {
  this.res.json(this.req.headers);
});

module.exports = app;
