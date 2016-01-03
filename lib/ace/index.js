var path = require('path');

module.exports = {
  name: 'ace',

  included: function(app) {
    var ace = path.join(app.bowerDirectory, 'ace-builds/src-noconflict/ace.js');
    var theme = path.join(app.bowerDirectory, 'ace-builds/src-noconflict/theme-twilight.js');
    var mode = path.join(app.bowerDirectory, 'ace-builds/src-noconflict/mode-powershell.js');
    app.import(ace);
    app.import(theme);
    app.import(mode);
  },

  isDevelopingAddon: function() {
    return true;
  }
};
