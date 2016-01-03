import Ember from 'ember';

export default Ember.Route.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			status:params.status,
			osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
			systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			//locationTree:this.get("locationSrv").tree(0,0).then(function(data) {return data.Content;}),
			statusData:[{ID:"pre_install",Name:"等待安装"},{ID:"installing",Name:"正在安装"},{ID:"success",Name:"安装成功"},{ID:"failure",Name:"安装失败"}]
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	var status = model.status === "all" ? null : model.status;
    	var form = {Status:status,OsID:null,HardwareID:null,SystemID:null,Keyword:null}
    	controller.send("queryAction",form);
    },
   	deactivate: function() {
   		clearInterval(this.get('controller').get('autoRefreshTimer'));
		this.get('controller').set("autoRefreshTimer",null);
	}
});
