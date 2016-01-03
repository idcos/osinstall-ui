import Ember from 'ember';

export default Ember.Route.extend({
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	osConfigSrv: Ember.inject.service('api/os-config/service'),
    hardwareSrv: Ember.inject.service('api/hardware/service'),
    systemConfigSrv: Ember.inject.service('api/system-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
        	osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
		    hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
            systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
        });
    },

    setupController: function(controller, model) {
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
        //reset
        controller.set('deviceList',null);
        controller.set('selectAllDevice',true);
        controller.set('isShowVmBlock',false);
        controller.set('isShowMultiSearchBlock',false);
    }
});
