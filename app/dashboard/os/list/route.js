import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "PXE模板管理",
        isShow:true,
    },
	osConfigSrv: Ember.inject.service('api/os-config/service'),
	model: function(params) {
        
    },

    setupController: function(controller, model) {
    	//console.log(model.rowList);
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
