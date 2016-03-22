import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	userSrv: Ember.inject.service('api/user/service'),
	isShowMoreTplMenu:false,
	autoRefreshDeviceNumTimer:null,
    autoRefreshDeviceNumTime:10000,
	actions:{
		showMoreTplMenuAction:function(){
			var isShowMoreTplMenu = this.get('isShowMoreTplMenu');
			if(isShowMoreTplMenu){
				set(this,'isShowMoreTplMenu',false);
			}else{
				set(this,'isShowMoreTplMenu',true);
			}
		},
		autoRefreshAction:function(){
            var self = this;
            this.set('autoRefreshDeviceNumTimer', setInterval(function() {
            	self.send("queryAction");
            }, self.get("autoRefreshDeviceNumTime")));
		},
		queryAction:function(){
            var session = this.get("userSrv").getLocalSession();
            var userID = 0;
            if(!Ember.isEmpty(session)){
                if(!Ember.isEmpty(session.Role) && session.Role != "Administrator"){
                    userID = parseInt(session.ID);
                }
            }
            var self = this;
            this.get('deviceSrv').getNumByStatus("installing",userID).then(function(data){
                self.set('model.installingDeviceNum',data.Content.count);
            });
            this.get('deviceSrv').getNumByStatus("failure",userID).then(function(data){
                self.set('model.failureDeviceNum',data.Content.count);
            });
		},
		logoutAction:function(){
			var self = this;
            var form = {};
            var model = self.get("model");
            form.AccessToken = model.session.AccessToken;
			self.get("userSrv").logout(form).then(function(data) {
                if(data.Status==="success"){
                   	self.get("userSrv").clearLocalSession();
                    self.transitionToRoute('login');
                } else {
                    Ember.$.notify({
                    	title: "<strong>操作失败:</strong>",
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
