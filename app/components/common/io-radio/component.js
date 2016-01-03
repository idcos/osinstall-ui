// import Ember from 'ember';

// const {
//     get,
//     set
// } = Ember;

// export default Ember.Component.extend({
//     item: null,
//     items: [],

//     tagName: 'input',
//     type: 'radio',
//     checked: false,

//     attributeBindings: ['type', 'name', 'checked'],
//     click: function(e) {
//         get(this, 'items').setEach('checked', false);
//         set(get(this, 'item'), 'checked', true);
//         this.sendAction('check', get(this, 'item'), get(this, 'items'));
//     }
// });


import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  type: 'radio',
  attributeBindings: ['type', 'htmlChecked:checked', 'value', 'name', 'disabled', 'required', 'data-error'],

  htmlChecked: function() {
    return this.get('value') === this.get('checked');
  }.property('value', 'checked'),

  change: function() {
    this.set('checked', this.get('value'));
  },

  _updateElementValue: function() {
    Ember.run.next(this, function() {
      this.$().prop('checked', this.get('htmlChecked'));
    });
  }.observes('htmlChecked')
});
