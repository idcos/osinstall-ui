/* global require, module, EmberENV */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

EmberENV = {
  LOG_STACKTRACE_ON_DEPRECATION: false
};

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });


  app.import('bower_components/bootstrap-validator/dist/validator.min.js');
  app.import('bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min.js');

  return app.toTree();
};
