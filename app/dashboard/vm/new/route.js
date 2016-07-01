import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "创建虚拟机",
        isShow:true,
    },
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	osConfigSrv: Ember.inject.service('api/os-config/service'),
    hardwareSrv: Ember.inject.service('api/hardware/service'),
    systemConfigSrv: Ember.inject.service('api/system-config/service'),
    deviceSrv: Ember.inject.service('api/device/service'),
    networkSrv: Ember.inject.service('api/network/service'),
    userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({
            deviceId:params.deviceId,
        	osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
		    hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
            systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
            deviceInfo:this.get('deviceSrv').getFull(params.deviceId).then(function(data){return data.Content;}),
            cpuData:[{ID:1,Name:1},{ID:2,Name:2},{ID:4,Name:4},{ID:8,Name:8},{ID:16,Name:16},{ID:32,Name:32},{ID:64,Name:64}],
            memoryData:[{ID:1024,Name:1},{ID:2048,Name:2},{ID:4096,Name:4},{ID:8192,Name:8},{ID:16384,Name:16},{ID:32768,Name:32},{ID:65536,Name:64}],
            newMacAddress:this.get('vmInstallSrv').createNewMacAddress().then(function(data){return data.Content;}),
            session:this.get("userSrv").getLocalSession(),
        });
    },

    setupController: function(controller, model) {
    	var vmInfo = {
            Hostname:null,
            Mac:model.newMacAddress,
            Ip:null,
            OsID:null,
            SystemID:null,
            isShowMore:false,
            CpuCoresNumber:1,
            MemoryCurrent:1024,
            DiskSize:60,
            Sn:model.deviceInfo.Sn,
            AccessToken:null,
        };
        model.vmInfo = vmInfo;
        controller.set("model",model);
        controller.send("assignIPAction");
    }
});
