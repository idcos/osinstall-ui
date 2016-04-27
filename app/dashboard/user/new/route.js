import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "添加新用户",
        isShow:true,
    },
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
    	return Ember.RSVP.hash({id:params.id,
    		session:this.get("userSrv").getLocalSession(),
			info:{Status:"Enable",Role:"User"},
			statusData:[{id:"Enable",name:"正常"},{id:"Disable",name:"锁定"}],
			roleData:[{id:"Administrator",name:"超级管理员"},{id:"User",name:"普通用户"}],
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
