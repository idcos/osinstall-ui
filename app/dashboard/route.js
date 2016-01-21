import Ember from 'ember';
export default Ember.Route.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
    
	model: function() {
        return Ember.RSVP.hash({
			
		});
    },
    
    setupController: function(controller, model) {
    	controller.set("model",model);
        controller.send("queryAction");
    	controller.send("autoRefreshAction");
    },
    deactivate: function() {
   		clearInterval(this.get('controller').get('autoRefreshDeviceNumTimer'));
		this.get('controller').set("autoRefreshDeviceNumTimer",null);
	}
});
