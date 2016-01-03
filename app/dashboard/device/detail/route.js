import Ember from 'ember';

export default Ember.Route.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('deviceSrv').getFull(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("item",model.info);
    }
});
