import Ember from 'ember';

import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "查看宿主机详情",
        isShow:true,
    },
	deviceSrv: Ember.inject.service('api/device/service'),
	vmHostSrv: Ember.inject.service('api/vm-host/service'),
	model: function(params) {
        return Ember.RSVP.hash({
        	sn:params.sn,
			deviceInfo:this.get('deviceSrv').getBySn(params.sn).then(function(data){return data.Content;}),
			vmHostInfo:this.get('vmHostSrv').get(params.sn).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	console.log(model);
    	controller.set("model",model);
    }
});
