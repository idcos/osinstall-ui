import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "修改PXE模板",
        isShow:true,
    },
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('osConfigSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
