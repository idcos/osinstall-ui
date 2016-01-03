import Ember from 'ember';

export default Ember.Route.extend({
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('osConfigSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
