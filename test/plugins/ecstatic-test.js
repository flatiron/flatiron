/*
 * ecstatic-test.js: Tests for flatiron app(s) using the ecstatic plugin
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    resourceful = require('ecstatic'),
    vows = require('vows');

var app = require('../../examples/ecstatic-app/app');

vows.describe('flatiron/plugins/ecstatic').addBatch({
  "A flatiron app using `flatiron.plugins.ecstatic": {
    topic: app,
    "should extend the app correctly": function (app) {
      assert.isString(app._ecstaticDir);
      assert.isFunction(app.static);
      assert.isFunction(app.http.before[0]);
      assert.equal(app.http.before[0].length, 3);
    }
  }
}).export(module);
