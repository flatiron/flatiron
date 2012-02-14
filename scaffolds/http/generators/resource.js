var app = require('flatiron').app;

var #CAMEL = app.resource.define('#NAME', function () {
  this.use(app.config.db.engine, app.config.db.options);

#PROP
  this.timestamps();
}
