import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
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
            var self = this;
            this.get('deviceSrv').getNumByStatus("installing").then(function(data){
                self.set('model.installingDeviceNum',data.Content.count);
            });
            this.get('deviceSrv').getNumByStatus("failure").then(function(data){
                self.set('model.failureDeviceNum',data.Content.count);
            });
		},
	}
});
