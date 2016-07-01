import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "录入设备",
        isShow:true,
    },
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	locationSrv: Ember.inject.service('api/location/service'),
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({
        	id:parseInt(params.id),
			osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
			systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			//locationData:this.get("locationSrv").list(10000,0,0).then(function(data) {return data.Content.list;}),
			locationTree:this.get("locationSrv").tree(0,0).then(function(data) {return data.Content;}),
			whetherData:[{id:"Yes",name:"是"},{id:"No",name:"否"}],
			session:this.get("userSrv").getLocalSession(),
		});
    },

	setupController: function(controller, model) {
		model.session = this.get("userSrv").getLocalSession();
		controller.set("model",model);
		var data = [{id:0,LocationID:null,IsSupportVm:"No",messageHostname:"<span class='text-muted'>主机名可自定义</span>",messageIp:"请提前在【网段管理】->【应用网段管理】里录入网段信息",messageManageIp:"",AccessToken:model.session.AccessToken,IsVm:"No"}];
		controller.set('rows', data);
	}
});
