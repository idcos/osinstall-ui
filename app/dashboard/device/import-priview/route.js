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
            selectAll:false,
            selectCount:0,
            rowList:[],
            recordCount:0,
            pageCount:0,
            page:1,
            pageCount:1,
            pageSize:500,
        });
    },

    setupController: function(controller, model) {
    	//console.log(model.rowList);
    	controller.set("model",model);
    	controller.send("queryAction");
    }
});
