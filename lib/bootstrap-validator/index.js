var path = require('path');

module.exports = {
  name: 'bootstrap-validator',

  included: function(app) {
    var validator = path.join(app.bowerDirectory, 'bootstrap-validator/dist/validator.js');
    app.import(validator);
  },

  isDevelopingAddon: function() {
    return true;
  }
};
