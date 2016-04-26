import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "用户管理",
        isShow:true,
    },
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			form:{Status:null},
            session:this.get("userSrv").getLocalSession(),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
