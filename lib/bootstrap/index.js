/*jshint node:true*/

var fs = require('fs'),
  path = require('path'),
  extend = require('util')._extend;

var defaultOptions = {
  importBootstrapTheme: false,
  importBootstrapJS: true,
  importBootstrapCSS: true,
  importBootstrapFont: true,
  addLessPath: true
};

module.exports = {
  name: 'bootstrap',

  included: function(app) {
    this._super.included(app);

    var emberCLIVersion = app.project.emberCLIVersion();
    if (emberCLIVersion < '0.0.41') {
      throw new Error('ember-cli-bootstrap requires ember-cli version 0.0.41 or greater.\n');
    }

    var base = path.join(app.bowerDirectory, '/bootstrap'),
      dirs = fs.readdirSync(base);

    if (dirs.indexOf('dist') < 0) {
      base = path.join(
        base,
        dirs.filter(function(dir) {
          return dir.startsWith('bootstrap-');
        }).pop()
      );
    }

    var dist = path.join(base, 'dist'),
      less = path.join(base, 'less'),
      options = extend(defaultOptions, app.options['bootstrapOptions']);

    // add bootstrap less path for ember-cli-less
    if (options.addLessPath) {
      var lessOptions = app.options.lessOptions || {};
      lessOptions.paths = lessOptions.paths || [];
      lessOptions.paths.push(less);
      app.options.lessOptions = lessOptions;
    }

    // Import js from bootstrap
    if (options.importBootstrapJS) {
      app.import(path.join(dist, 'js/bootstrap.js'));
    }

    // Import css from bootstrap
    if (options.importBootstrapCSS) {
      app.import(path.join(dist, 'css/bootstrap.css'));
      app.import(path.join(dist, 'css/bootstrap.css.map'), {
        destDir: 'assets'
      });
    }

    if (options.importBootstrapTheme) {
      app.import(path.join(dist, 'css/bootstrap-theme.css'));
      app.import(path.join(dist, 'css/bootstrap-theme.css.map', {
        destDir: 'assets'
      }));
    }

    // Import glyphicons
    if (options.importBootstrapFont) {
      app.import(path.join(dist, 'fonts/glyphicons-halflings-regular.eot'), {
        destDir: '/fonts'
      });
      app.import(path.join(dist, 'fonts/glyphicons-halflings-regular.svg'), {
        destDir: '/fonts'
      });
      app.import(path.join(dist, 'fonts/glyphicons-halflings-regular.ttf'), {
        destDir: '/fonts'
      });
      app.import(path.join(dist, 'fonts/glyphicons-halflings-regular.woff'), {
        destDir: '/fonts'
      });
      app.import(path.join(dist, 'fonts/glyphicons-halflings-regular.woff2'), {
        destDir: '/fonts'
      });
    }
  },

  isDevelopingAddon: function() {
    return true;
  }
};
