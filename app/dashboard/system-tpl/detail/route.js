import Ember from 'ember';

export default Ember.Route.extend({
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('systemConfigSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
