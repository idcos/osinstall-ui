import Ember from 'ember';
export default Ember.Route.extend({
    deviceSrv: Ember.inject.service('api/device/service'),
	userSrv: Ember.inject.service('api/user/service'),
    
	model: function() {
        return Ember.RSVP.hash({
			
		});
    },
    
    setupController: function(controller, model) {
        var session = this.get("userSrv").getLocalSession();
        if(Ember.isEmpty(session)){
            this.get('controller').transitionToRoute('login');
        }else{
            if(Ember.isEmpty(session.Username) || Ember.isEmpty(session.Role)){
                this.get('controller').transitionToRoute('login');
            }
        }
        model.session = session;

    	controller.set("model",model);
        controller.send("queryAction");
    	controller.send("autoRefreshAction");
    },
    deactivate: function() {
   		clearInterval(this.get('controller').get('autoRefreshDeviceNumTimer'));
		this.get('controller').set("autoRefreshDeviceNumTimer",null);
	}
});
