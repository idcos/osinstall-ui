import Ember from 'ember';

import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "设备型号管理",
        isShow:true,
    },
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function() {
        return Ember.RSVP.hash({
			companyData:this.get('hardwareSrv').getCompanyByGroup().then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
