import Ember from 'ember';

export default Ember.Route.extend({
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	model: function(params) {
        
    },

    setupController: function(controller, model) {
    	//console.log(model.rowList);
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
