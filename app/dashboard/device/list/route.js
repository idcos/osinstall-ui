import Ember from 'ember';
import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "设备列表",
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
			//locationTree:this.get("locationSrv").tree(0,0).then(function(data) {return data.Content;}),
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
		    session:this.get("userSrv").getLocalSession(),
        });
    },

    setupController: function(controller, model) {
    	var vmInfo = {
                Host:[{Hostname:"",Ip:"",Mac:model.newMacAddress,Os:""}],
                DisplayType:"serialPorts",
                Cpu:{CoresNumber:1,isShowCpuMore:false,isShowCpuTopBlock:false,HotPlug:false,
                    Passthrough:false,TopSockets:1,TopCores:1,TopThreads:1,isShowCpuPinningBlock:false,Pinning:""},
                Memory:{Current:1024,Max:1024,isShowMemoryMore:false,Ksm:false},
                Disk:{Type:"raw",Size:60,isShowDiskMore:false,BusType:"virtio",CacheMode:"writeback",IOMode:"default"},
                Network:{Type:"bridge",DeviceType:"virtio"},
                Display:{Type:"serialPorts",Password:"",UpdatePassword:false}
            }
        model.vmInfo = model.vmInfoTpl = vmInfo;

        var batchVmInfo = {
            VmNumber:1,
            OsID:null,
            isShowMore:false,
            CpuCoresNumber:1,
            MemoryCurrent:1024,
            DiskSize:60,
        };
        model.batchVmInfo = model.batchVmInfoTpl = batchVmInfo;

    	controller.set("model",model);
    	var status = model.status === "all" ? null : model.status;
    	var form = {Status:status,OsID:null,HardwareID:null,SystemID:null,Keyword:null};
    	controller.send("queryAction",form);
    },
   	deactivate: function() {
   		clearInterval(this.get('controller').get('autoRefreshTimer'));
		this.get('controller').set("autoRefreshTimer",null);
        this.get('controller').set("isShowingModal",false);
        this.get('controller').set("isShowingModal2",false);
	}
});
