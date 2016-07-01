import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('error');
  this.route('dashboard', function() {
    this.route('vsInstall');
    this.route('device', function() {
      this.route('list', {
        path: 'list/:status',
      });
      this.route('new');
      this.route('import');
      this.route('preInstall');
      this.route('installing');
      this.route('failure');
      this.route('install');
      this.route('importPriview', {
        path: 'importPriview/:id'
      });
      this.route('detail', {
        path: 'detail/:id'
      });
      this.route('manufacturer', {
        path: 'manufacturer/:id'
      });
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('scan', function() {
        this.route('detail', {
          path: 'detail/:id'
        });
        this.route('list');
      });
      this.route('scanInstall');

      this.route('callback', function() {
        this.route('list', {
          path: 'list/:id'
        });
      });
    });

    this.route('network', function() {
      this.route('list');
      this.route('new', {
        path: 'new/:id',
      });
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('detail', {
        path: 'detail/:id'
      });
    });

    this.route('os', function() {
      this.route('new', {
        path: 'new/:id',
      });
      this.route('list');
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('detail', {
        path: 'detail/:id'
      });
    });

    this.route('systemTpl', function() {
      this.route('list');
      this.route('new', {
        path: 'new/:id',
      });
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('detail', {
        path: 'detail/:id'
      });
    });

    this.route('pxeTpl', function() {
      this.route('list');
      this.route('new');
    });

    this.route('hardware', function() {
      this.route('list');
      this.route('import');
      this.route('new', {
        path: 'new/:id',
      });
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('detail', {
        path: 'detail/:id'
      });
    });
    this.route('main');

    this.route('report', function() {
      this.route('status');
      this.route('install');
      this.route('main');
    });
    this.route('location', function() {
      this.route('list', {
        path: 'list/:pid',
      });
      this.route('new', {
        path: 'new/:pid',
      });
      this.route('edit', {
        path: 'edit/:id/:pid',
      });
      this.route('room');
      this.route('newRoom');
    });
    this.route('product', function() {
      this.route('new');
      this.route('list');
    });
    this.route('deviceLog', {
        path: 'deviceLog/:deviceId/:type',
      }, function() {
        this.route('cmd');
    });

    this.route('log', function() {
      this.route('detail', {
        path: 'detail/:deviceId/:type',
      });
      this.route('cmd', {
        path: 'cmd/:deviceId/:type',
      });
    });

    this.route('company', function() {
      this.route('hardware', function() {
        this.route('list');
        this.route('new', {
          path: 'new/:id',
        });
        this.route('edit', {
          path: 'edit/:id'
        });
        this.route('detail', {
          path: 'detail/:id'
        });
        this.route('import');
      });
    });

    this.route('vm', function() {
      this.route('list', {
        path: 'list/:deviceId',
      });
      this.route('detail', {
          path: 'detail/:id'
        });
      this.route('new', {
          path: 'new/:deviceId',
      });
      this.route('guideNew');
      this.route('hostList', {
          path: 'hostList/:status',
      });

      this.route('host', function() {
        this.route('list', {
          path: 'list/:status',
        });
        this.route('detail', {
          path: 'detail/:sn',
        });
        this.route('log', {
          path: 'log/:deviceId/:type',
        });
      });

      this.route('log', function() {
        this.route('detail', {
          path: 'detail/:deviceId/:type',
        });
        this.route('cmd', {
          path: 'cmd/:deviceId/:type',
        });
      });
    });

    this.route('user', function() {
      this.route('list');
      this.route('detail', {
        path: 'detail/:id'
      });
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('new');
      this.route('my');
    });

    this.route('manageNetwork', function() {
      this.route('list');
      this.route('new', {
        path: 'new/:id',
      });
      this.route('edit', {
        path: 'edit/:id'
      });
      this.route('detail', {
        path: 'detail/:id'
      });
    });
    this.route('guide');
  });
  this.route('login');
});

export default Router;
