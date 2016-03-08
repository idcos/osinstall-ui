import Ember from 'ember';

export default Ember.Route.extend({
	userSrv: Ember.inject.service('api/user/service'),
	model: function(params) {
    	return Ember.RSVP.hash({
			info:{Username:"",Password:""},
			isRememberPassword:false,
		});
    },

    setupController: function(controller, model) {
    	var osinstallRememberUsername = window.localStorage.getItem("osinstallRememberUsername");
    	if(!Ember.isEmpty(osinstallRememberUsername)){
    		model.info.Username = osinstallRememberUsername;
    	}
    	var osinstallRememberPassword = window.localStorage.getItem("osinstallRememberPassword");
    	if(!Ember.isEmpty(osinstallRememberPassword)){
    		model.info.Password = osinstallRememberPassword;
    	}

    	controller.set("model",model);
    }
});
