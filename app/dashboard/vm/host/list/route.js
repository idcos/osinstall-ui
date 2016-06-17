import Ember from 'ember';
import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "宿主机列表",
        isShow:true,
    },
	deviceSrv: Ember.inject.service('api/device/service'),
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
    vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	userSrv: Ember.inject.service('api/user/service'),

	model: function(params) {
        return Ember.RSVP.hash({
			status:params.status,
			osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
			systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
            statusData:[{ID:"pre_install",Name:"等待安装"},{ID:"installing",Name:"正在安装"},{ID:"success",Name:"安装成功"},{ID:"failure",Name:"安装失败"}],
			isAvailableData:[{ID:"Yes",Name:"可用"},{ID:"No",Name:"不可用"}],
		    session:this.get("userSrv").getLocalSession(),
            messageUpdateVmHost:null,
        });
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	var status = "success";
        var deviceId = null;
        var re = /^[0-9]*]*$/;
        if(re.test(model.status)){
            deviceId = parseInt(model.status);
        }
    	var form = {Status:status,OsID:null,HardwareID:null,SystemID:null,Keyword:null,ID:deviceId};
    	controller.send("queryAction",form);
    }
});
