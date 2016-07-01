import Ember from 'ember';

import breadCrumbMixin from '../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "系统设置",
        isShow:true,
    },
    dhcpSubnetSrv: Ember.inject.service('api/dhcpSubnet/service'),
    platformConfigSrv: Ember.inject.service('api/platformConfig/service'),
	model: function(params) {
        return Ember.RSVP.hash({
            dhcpSubnetData:this.get('dhcpSubnetSrv').list(1000000,0).then(function(data){return data.Content.list;}),
            platformConfigData:this.get('platformConfigSrv').getByName("IsShowVmFunction").then(function(data){return data.Content;}),
            isCreateVmData:[{id:"Yes",name:"是"},{id:"No",name:"否"}],
            dhcpFormData:{StartIp:"",EndIp:"",Gateway:""},
            vmFormData:{IsShowVmFunction:null},
            isShowStep1:true,
            isShowStep2:false,
            dhcpMessage:null,
            vmInfoMessage:null,
        });
    },

    setupController: function(controller, model) {
        if(!Ember.isEmpty(model.dhcpSubnetData) && model.dhcpSubnetData.length > 0){
            model.dhcpFormData = model.dhcpSubnetData[0];
        }

        if(!Ember.isEmpty(model.platformConfigData) && !Ember.isEmpty(model.platformConfigData.Content)){
            model.vmFormData.IsShowVmFunction = model.platformConfigData.Content;
        }
    	controller.set("model",model);
    }
});
