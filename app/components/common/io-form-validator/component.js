import Ember from 'ember';

export default Ember.Component.extend({
  form: null,
  type: '',

  submit: function(e) {
    if (e && e.isDefaultPrevented && !e.isDefaultPrevented()) {
      this.sendAction('submitForm', this.get('form'), this.get('type'));
    }
   	 e.preventDefault();
  },

  didInsertElement: function() {
    //this.$('form').validator();
  },

  willDestroy: function() {
    var $form = this.$('form');
    if ($form) {
      $form.validator('destroy');
    }
  }
});