import Ember from 'ember';

export default Ember.Route.extend({
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function() {
        return Ember.RSVP.hash({
			companyData:this.get('hardwareSrv').getCompanyByGroup().then(function(data){return data.Content;}),
        });
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
        controller.send("queryAction");

        window.setTimeout(function(){
            controller.send("checkOnlineUpdateAction");
        }, 2000);

    }
});
