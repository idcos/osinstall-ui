import Ember from 'ember';

export default Ember.Route.extend({
    vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	model: function() {
        return Ember.RSVP.hash({
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
                Host:[{Hostname:"",Ip:"",Mac:model.newMacAddress,Os:""}],
                DisplayType:"serialPorts",
                Cpu:{CoresNumber:1,isShowCpuMore:false,isShowCpuTopBlock:false,HotPlug:false,
                    Passthrough:false,TopSockets:1,TopCores:1,TopThreads:1,isShowCpuPinningBlock:false,Pinning:""},
                Memory:{Current:1024,Max:1024,isShowMemoryMore:false,Ksm:false},
                Disk:{Type:"raw",Size:61,isShowDiskMore:true,BusType:"virtio",CacheMode:"writeback",IOMode:"default"},
                Network:{NetworkType:"bridge",DeviceType:"virtio"},
                Display:{Type:"serialPorts",Password:"",UpdatePassword:false}
            }
        model.vmInfo = vmInfo;
    	controller.set("model",model);
    }
});