/* global require, module, EmberENV */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

EmberENV = {
  LOG_STACKTRACE_ON_DEPRECATION: false
};

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    fingerprint: {
    	exclude: ["novnc/**/*"]
    },
  });
  app.import('bower_components/bowser/bowser.min.js');
  return app.toTree();
};
