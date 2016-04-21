import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "查看用户详情",
        isShow:true,
    },
	usergSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('usergSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
