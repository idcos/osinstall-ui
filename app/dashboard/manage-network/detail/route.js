import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "查看管理网段详情",
        isShow:true,
    },
	networkSrv: Ember.inject.service('api/manageNetwork/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('networkSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
