import Ember from 'ember';

export default Ember.Select.extend({  
  change: function () {
    var self = this;
    this._super();
    var callback = this.get('onChange');
    if (callback) {
      Em.run.later(function () {
        self.get('controller').send(callback);
      });
    }
  }
});
