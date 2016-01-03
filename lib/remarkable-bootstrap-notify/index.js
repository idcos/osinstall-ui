var path = require('path');

module.exports = {
  name: 'remarkable-bootstrap-notify',

  included: function(app) {
    var notify = path.join(app.bowerDirectory, 'remarkable-bootstrap-notify/dist/bootstrap-notify.js');
    app.import(notify);
  },

  isDevelopingAddon: function() {
    return true;
  }
};
