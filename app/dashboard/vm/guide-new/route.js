import Ember from 'ember';

export default Ember.Route.extend({
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			deviceId:params.deviceId !== "all" ? params.deviceId : null,
			osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
			hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
            systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
            statusData:[{ID:"pre_install",Name:"等待安装"},{ID:"installing",Name:"正在安装"},{ID:"success",Name:"安装成功"},{ID:"failure",Name:"安装失败"}],	
			
			displayTypeData:[{id:"serialPorts",name:"串口"},{id:"vnc",name:"VNC"},{id:"spice",name:"Spice"}],
            osData:[{id:"centos_x86_6",name:"centos_x86_6"},{id:"sles11sp4-x86_64",name:"sles11sp4-x86_64"}],
			diskTypeData:[{id:"raw",name:"raw"},{id:"qcow2",name:"qcow2"},{id:"lvm",name:"lvm"}],
            diskBusTypeData:[{id:"ide",name:"IDE"},{id:"virtio",name:"Virtio"}],
            diskCacheModeData:[{id:"default",name:"default"},{id:"none",name:"none"},{id:"writeback",name:"writeback"},{id:"writethrought",name:"writethrought"}],
            diskIOModeData:[{id:"default",name:"default"},{id:"native",name:"native"},{id:"threads",name:"threads"}],
            networkTypeData:[{id:"bridge",name:"桥接"},{id:"nat",name:"NAT"}],
            networkDeviceTypeData:[{id:"e1000",name:"e1000"},{id:"rtl8139",name:"rtl8139"},{id:"virtio",name:"virtio"}],
            newMacAddress:this.get('vmInstallSrv').createNewMacAddress().then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	var vmInfo = {
                Host:[{Hostname:"",Ip:"",Mac:model.newMacAddress,Os:"",DeviceId:null}],
                DisplayType:"serialPorts",
                Cpu:{CoresNumber:1,isShowCpuMore:false,isShowCpuTopBlock:false,HotPlug:false,
                    Passthrough:false,TopSockets:1,TopCores:1,TopThreads:1,isShowCpuPinningBlock:false,Pinning:""},
                Memory:{Current:1024,Max:1024,isShowMemoryMore:false,Ksm:false},
                Disk:{Type:"raw",Size:60,isShowDiskMore:false,BusType:"virtio",CacheMode:"writeback",IOMode:"default"},
                Network:{Type:"bridge",DeviceType:"virtio"},
                Display:{Type:"serialPorts",Password:"",UpdatePassword:false}
            }
        model.vmInfo = model.vmInfoTpl = vmInfo;

    	controller.set("model",model);
        //reset
        controller.set('currentStep',0);
        controller.set('nextStep',1);
        controller.set('lastStep',-1);
        controller.set('isShowMemoryMore',false);
        controller.set('isShowDiskMore',false);
        controller.set('isShowingModal',true);
        controller.set('currentDeviceIndex',0);
        controller.set('isShowMultiSearchBlock',false);
        controller.set('deviceList',null);
    },
});