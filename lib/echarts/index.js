var path = require('path');

module.exports = {
  name: 'echarts',

  included: function(app) {
    var echarts = path.join(app.bowerDirectory, 'echarts/build/source/echarts-all.js');
    app.import(echarts);
  },

  isDevelopingAddon: function() {
    return true;
  }
};
