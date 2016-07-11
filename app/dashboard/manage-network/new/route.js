import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "添加管理网段",
        isShow:true,
    },
	networkSrv: Ember.inject.service('api/manageNetwork/service'),
	model: function(params) {
        if(params.id === "new"){
            return {info:{Vlan:"",Trunk:"",Bonding:""}};
        }else{
            return Ember.RSVP.hash({
                id:params.id,
                info:this.get('networkSrv').get(params.id).then(function(data){return data.Content;}),
            });
        }
    },

    setupController: function(controller, model) {
        model.noticeMessage = '<span class="text-muted">格式如:192.168.0.1/24</span>';
    	controller.set("model",model);
    }
});
