import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
        return Ember.RSVP.hash({
			calculateRule:[{id:">",name:"大于"},{id:"=",name:"等于"},{id:"<",name:"小于"},{id:"!=",name:"不等于"}],
		});
    },

	setupController: function(controller, model) {
		controller.set("model",model);
		
		var form = {Status:status,OsID:null,HardwareID:null,SystemID:null,Keyword:null};
    	controller.send("queryAction",form);
    	controller.send("queryCompanyAction");
	}
});