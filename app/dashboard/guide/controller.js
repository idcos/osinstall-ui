import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
    dhcpSubnetSrv: Ember.inject.service('api/dhcpSubnet/service'),
	platformConfigSrv: Ember.inject.service('api/platformConfig/service'),
    isShowNetmask:false,

	actions:{
		saveVmInfoAction: function() {
			var self = this;
        	var data = this.get("model.vmFormData");
            self.set("model.vmInfoMessage","<span class='text-success'>数据正在处理中,请稍候...</span>");
        	var form = {};
            form.Name = "IsShowVmFunction";
            form.Content = data.IsShowVmFunction;
            window.sessionStorage.setItem("osinstallIsShowVmFunction",form.Content);
            self.get("platformConfigSrv").save(form).then(function(data) {
                self.set("model.vmInfoMessage",null);
                if(data.Status==="success"){
                    Ember.$.notify({
                    	message: "操作成功!"
                    }, {
                    	animate: {
                    		enter: 'animated fadeInRight',
                    		exit: 'animated fadeOutRight'
                    	},
                    	type: 'success'
                    });
                    //self.transitionToRoute('dashboard.main');
                    window.setTimeout(function(){
                        window.top.location.href = "/";
                    }, 1000);
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
        saveDHCPAction: function() {
            var self = this;
            var form = this.get("model.dhcpFormData");
            self.set("model.dhcpMessage","<span class='text-success'>数据正在处理中,请稍候...</span>");
            self.get("dhcpSubnetSrv").save(form).then(function(data) {
                self.set("model.dhcpMessage",null);
                if(data.Status === "success"){
                    self.send("skipStep1Action");
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
        skipStep1Action:function(){
            var self = this;
            self.set("model.isShowStep1",false);
            self.set("model.isShowStep2",true);
        },
        skipStep2Action:function(){
            var self = this;
            self.transitionToRoute('dashboard.main');
        },
	}
});
