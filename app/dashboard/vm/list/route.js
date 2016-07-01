import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "虚拟机列表",
        isShow:true,
    },
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
    vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			deviceId:params.deviceId !== "all" ? params.deviceId : null,
			osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
            statusData:[{ID:"pre_install",Name:"等待安装"},{ID:"installing",Name:"正在安装"},{ID:"success",Name:"安装成功"},{ID:"failure",Name:"安装失败"}],
			runStatusData:[{ID:"running",Name:"运行中"},{ID:"stop",Name:"已停止"}],
            isButtonLock:true,
            buttonLockNoticeInfo:"先点击旁边的解锁按钮后才能使用哦",
            session:this.get("userSrv").getLocalSession(),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
        controller.set("selectAll",false);
    	var deviceId = model.deviceId === "all" ? null : model.deviceId;
    	var form = {DeviceID:parseInt(deviceId),OsID:null,Keyword:null};
    	controller.send("queryAction",form);
    },
});