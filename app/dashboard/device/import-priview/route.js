import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "批量录入",
        isShow:true,
    },
	model: function(params) {
        return Ember.RSVP.hash({
        	id:params.id,
		});
    },

    setupController: function(controller, model) {
    	//console.log(model.rowList);
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
