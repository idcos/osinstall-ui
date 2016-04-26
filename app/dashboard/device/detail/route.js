import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "设备详情",
        isShow:true,
    },
	deviceSrv: Ember.inject.service('api/device/service'),
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
            info:this.get('deviceSrv').getFull(params.id).then(function(data){return data.Content;}),
            callbackList:this.get('deviceSrv').getInstallCallbackList(params.id).then(function(data){return data.Content;}),
			manufacturer:this.get('deviceSrv').getScanByDeviceId(params.id).then(function(data){return data.Content;}),
			session:this.get("userSrv").getLocalSession(),
		});
    },

    setupController: function(controller, model) {
    	var hasPurviewOperation = false;
    	var session = model.session;
    	if(!Ember.isEmpty(session)){
        	if(!Ember.isEmpty(session.Role) && session.Role === "Administrator"){
            	hasPurviewOperation = true;
            }

            if(!Ember.isEmpty(session.ID) && model.info.UserID === session.ID){
                hasPurviewOperation = true;
            }
        }
        model.hasPurviewOperation = hasPurviewOperation;

    	controller.set("item",model.info);
        controller.set("model",model);
    }
});
