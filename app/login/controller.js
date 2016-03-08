import Ember from 'ember';

export default Ember.Controller.extend({
	userSrv: Ember.inject.service('api/user/service'),
	actions:{
		loginAction: function() {
			var self = this;
        	var form = this.get("model.info");
        	self.get("userSrv").login(form).then(function(data) {
                if(data.Status==="success"){
                    self.get("userSrv").createLocalSession(data.Content);
                    
                    var isRememberPassword = self.get("model.isRememberPassword");
                    if(isRememberPassword === true){
                        window.localStorage.setItem("osinstallRememberUsername",form.Username);
                        window.localStorage.setItem("osinstallRememberPassword",form.Password);
                    }else{
                        window.localStorage.clear();
                    }
                    self.transitionToRoute('dashboard.main');
                } else {
                    Ember.$.notify({
                    	title: "<strong>登录失败:</strong>",
                    	message: data.Message
                    }, {
                    	animate: {
                    		enter: 'animated fadeInRight',
                    		exit: 'animated fadeOutRight'
                    	},
                    	type: 'danger'
                    });
                }
            });
        },
	}
});
