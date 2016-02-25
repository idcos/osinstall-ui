import Ember from 'ember';

export default Ember.Route.extend({
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
