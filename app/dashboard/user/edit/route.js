import Ember from 'ember';

export default Ember.Route.extend({
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
    	return Ember.RSVP.hash({id:params.id,
			info:this.get('userSrv').get(params.id).then(function(data){return data.Content;}),
			statusData:[{id:"Enable",name:"正常"},{id:"Disable",name:"锁定"}],
			roleData:[{id:"Administrator",name:"超级管理员"},{id:"User",name:"普通用户"}],
		});
    },

    setupController: function(controller, model) {
    	model.info.Password = null;
    	controller.set("model",model);
    }
});
