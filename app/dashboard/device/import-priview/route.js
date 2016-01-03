import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
        return Ember.RSVP.hash({
        	id:params.id,
		});
    },

    setupController: function(controller, model) {
    	//console.log(model.rowList);
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
