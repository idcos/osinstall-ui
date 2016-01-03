import Ember from 'ember';

export default Ember.Route.extend({
	locationSrv: Ember.inject.service('api/location/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			pid:params.pid,
            info:this.get("locationSrv").get(params.pid).then(function(data) {return data.Content;}),
            locationName:this.get("locationSrv").getLocationTreeNameById(params.pid).then(function(data) {return data.Content;}),
		});
    },

    setupController: function(controller, model) {
        /*
        if(!Ember.isEmpty(model.info.Pid)){
            console.log(model.info.Pid);
            
            this.get("locationSrv").get(model.info.Pid).then(function(data) {
                console.log(data);
            });
            
        }
        */
    	controller.set("model",model);
    	controller.send("queryAction",model.pid);
    }
});
