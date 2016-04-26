import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "查看设备安装日志",
        isShow:true,
    },
    deviceLogSrv: Ember.inject.service('api/device-log/service'),
	model: function(params) {
        return Ember.RSVP.hash({
        	deviceId:params.deviceId,
			info:this.get('deviceLogSrv').list(params.deviceId,params.type,"id ASC",0).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
