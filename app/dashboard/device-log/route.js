import Ember from 'ember';

export default Ember.Route.extend({
	deviceLogSrv: Ember.inject.service('api/device-log/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			info:this.get('deviceLogSrv').list(params.deviceId,params.type).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
