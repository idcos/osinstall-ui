import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
        
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
