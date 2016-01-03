import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	didInsertElement: function() {
		this.$('[data-toggle="tooltip"]').tooltip()
	}
});