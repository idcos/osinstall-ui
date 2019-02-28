import Ember from 'ember'
export default Ember.Controller.extend({
  actions: {
    viewResult: function (item) {
      let model = this.get('model')
      Ember.set(model, 'taskResults', item.Content)
      if (item.Content == '') {
        Ember.set(model, 'taskResults', '无结果')
      }
  }}
})
