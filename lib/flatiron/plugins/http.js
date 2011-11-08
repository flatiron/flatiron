
var sugarskull = require('sugarskull'),
    http;

try {
  //
  // Attempt to progressively enhance the flatiron object by 
  // adding ourselves to the plugins
  //
  http = require('flatiron-http');
}
catch (ex) {
  //
  // Do nothing since this is a progressive enhancement
  //
  console.warn('flatiron.plugins.http requires the `flatiron-http` module from npm');
  console.warn('install using `npm install flatiron-http`.');
  module.exports = null;
  return;
}

//
// Name this plugin.
//
exports.name = 'http';

exports.attach = function (options) {
  var app = this;
  
  //
  // Define the `http` namespace on the app for later use
  //
  app.http = {};
  app.http.use = [];
  app.http.useAfter = [];
  app.router = new sugarskull.http.Router().configure({
    async: true
  });
  
  app.start = function (options, callback) {
    
  };
  
  app.listen = function (port, host, callback) {
    
  };
};