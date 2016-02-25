import Ember from 'ember';

export default Ember.Route.extend({
	usergSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('usergSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
