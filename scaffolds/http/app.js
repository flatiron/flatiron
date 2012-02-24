var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.resourceful, { root: __dirname });
app.use(flatiron.plugins.plates, { root: __dirname });
app.use(flatiron.plugins.helper, { root: __dirname });
app.use(flatiron.plugins.dispatch, { root: __dirname });
app.use(flatiron.plugins.http, { routes: app.routes, attach: app.helpers });

app.start(3000);
