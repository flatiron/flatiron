/*
 * index.js: Top-level plugin exposing HTTP features in flatiron
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var http = exports;

http.stack        = require('./core').stack;
http.createServer = require('./core').createServer;
