import Ember from 'ember';

export default Ember.Route.extend({
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('vmInstallSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("item",model.info);
    }
});
