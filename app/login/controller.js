import Ember from 'ember';

export default Ember.Controller.extend({
	userSrv: Ember.inject.service('api/user/service'),
    platformConfigSrv: Ember.inject.service('api/platformConfig/service'),
	actions:{
		loginAction: function() {
			var self = this;
        	var form = this.get("model.info");
            if(!self.get("userSrv").isLocalStorageSupported()){
                Ember.$.notify({
                        title: "<strong>登录失败:</strong>",
                        message: "当前浏览器不支持local storage，请禁用隐身模式或使用最新版Chrome浏览器!"
                    }, {
                        animate: {
                            enter: 'animated fadeInRight',
                            exit: 'animated fadeOutRight'
                        },
                        type: 'danger'
                    });
                return ;
            }

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
                    window.sessionStorage.setItem("osinstallIsShowVmFunction","No");
                    self.get('platformConfigSrv').getByName("IsShowVmFunction").then(function(response){
                        if(response.Status !== "success"){
                            Ember.$.notify({
                                title: "<strong>登录失败:</strong>",
                                message: response.Message
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                            return ;
                        }
                        if(Ember.isEmpty(response.Content) || Ember.isEmpty(response.Content.Content)){
                            self.transitionToRoute('dashboard.guide');
                        }else{
                            window.sessionStorage.setItem("osinstallIsShowVmFunction",response.Content.Content);
                            self.transitionToRoute('dashboard.main');
                        }
                    });
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
