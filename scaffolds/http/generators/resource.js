var app = require('flatiron').app;

app.#CAMEL = app.resource.define('#NAME', function () {
  this.use(app.config.get('db').engine, app.config.get('db').options);

#PROP
  this.timestamps();
});
