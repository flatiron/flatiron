var flatiron = require('../../flatiron'),
    common = flatiron.common,
    app = flatiron.app;

module.exports = function (callback) {
  app.log.info('flatiron ' + ('v' + flatiron.version).yellow.bold);
}
