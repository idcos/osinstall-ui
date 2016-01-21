import Ember from 'ember';

export default Ember.Route.extend({
	setupController: function(controller, model) {
		var bowser = window.bowser;
		if (!bowser.webkit && (bowser.msie && bowser.version < 10)) {
			controller.transitionToRoute('error');
		}
	}
});
