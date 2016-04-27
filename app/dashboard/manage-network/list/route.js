import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "管理网段管理",
        isShow:true,
    },
	model: function() {
        
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
