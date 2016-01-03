import Ember from 'ember';
export default Ember.Route.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	model: function() {
        return Ember.RSVP.hash({
			installingDeviceNum:this.get('deviceSrv').getNumByStatus("installing").then(function(data){return data.Content.count;}),
			failureDeviceNum:this.get('deviceSrv').getNumByStatus("failure").then(function(data){return data.Content.count;}),
		});
    },
    setupController: function(controller, model) {
    	controller.set("model",model);
    	controller.send("autoRefreshAction");
    },
    deactivate: function() {
   		clearInterval(this.get('controller').get('autoRefreshDeviceNumTimer'));
		this.get('controller').set("autoRefreshDeviceNumTimer",null);
	}
});
