import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "修改系统模板",
        isShow:true,
    },
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('systemConfigSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
