/*
 * flatiron.js: An elegant blend of convention and configuration for building apps in Node.js and the browser.
 *
 * Copyright(c) 2011 Nodejitsu Inc. <info@nodejitsu.com>
 * MIT LICENCE
 *
 */
 
var flatiron = exports,
    _app;

//
// ### Export core `flatiron` modules 
//
flatiron.App = require('./flatiron/app').App;


//
// ### getter @app {flatiron.App} 
// Gets the default top-level Application for `flatiron`
//
flatiron.__defineGetter__('app', function () {
  if (!_app) {
    _app = new flatiron.App();
  }
  
  return _app;
});

//
// ### setter @app {flatiron.App} 
// Sets the default top-level Application for `flatiron`
//
flatiron.__defineSetter__('app', function (value) {
  _app = value;
});

//
// ### function createApp (options)
// #### @options {Object} Options for the application to create
// Creates a new instance of `flatiron.App` with the 
// specified `options`.
//
flatiron.createApp = function (options) {
  return new flatiron.App(options);
};