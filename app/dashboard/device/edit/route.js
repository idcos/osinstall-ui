import Ember from 'ember';

export default Ember.Route.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	locationSrv: Ember.inject.service('api/location/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('deviceSrv').getFull(params.id).then(function(data){return data.Content;}),
			osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
			systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			locationTree:this.get("locationSrv").tree(0,0).then(function(data) {return data.Content;}),
			whetherData:[{id:"Yes",name:"是"},{id:"No",name:"否"}],
		});
    },

    setupController: function(controller, model) {
    	var data = [];
    	data.pushObject(model.info);
    	controller.set("rows",data);
    	controller.set("model",model);
    }
});
