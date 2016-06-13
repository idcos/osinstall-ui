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
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
        	osConfigData:this.get('osConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
		    hardwareData:this.get('hardwareSrv').list(10000,0).then(function(data){return data.Content.list;}),
            systemConfigData:this.get('systemConfigSrv').list(10000,0).then(function(data){return data.Content.list;}),
            assignRuleData:[{ID:"Equally",Name:"平均分配(平均分布在宿主机上)"},{ID:"Queue",Name:"顺序分配(用满一台宿主机再分配到另一台)"},{ID:"SearchHost",Name:"特定分配(选择特定的宿主机)"}],
        });
    },

    setupController: function(controller, model) {
    	var batchVmInfo = {
            AssignRule:null,
            VmNumber:1,
            OsID:null,
            isShowMore:false,
            CpuCoresNumber:1,
            MemoryCurrent:1024,
            DiskSize:60,
            Hostname:"hostname-{i}",
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
