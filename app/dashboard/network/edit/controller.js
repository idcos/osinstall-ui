import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	networkSrv: Ember.inject.service('api/network/service'),
    isShowNetmask:false,

    networkChange: function() {
        var self = this;
        set(self,"model.noticeMessage",'<span class="text-muted">格式如:192.168.0.1/24</span>');
        var network = this.get('model.info.Network');
        if(!Ember.isEmpty(network)){
            self.get("networkSrv").getCidrInfoByNetwork(network).then(function(data) {
                if(data.Status==="success"){
                    set(self,"model.info.Netmask",data.Content.Mask);
                    var ipNum = parseInt(data.Content.IPNum);
                    if(ipNum > 254){
                        set(self,"model.noticeMessage","<span class='text-danger'>该网段对应有 "+ipNum+" 个IP，IP段入库需要较长时间，建议填写小的网段!</span>");
                    }
                }
            });
            set(this,"isShowNetmask",true);
        }else{
          set(this,"isShowNetmask",false);
        }
    }.observes("model.info.Network"),

	actions:{
		saveAction: function() {
			var self = this;
        	var form = this.get("model.info");
            self.set("message","<span class='text-success'>数据正在处理中,请稍候...</span>");
        	self.get("networkSrv").update(form).then(function(data) {
                self.set("message",null);
                if(data.Status==="success"){
                    Ember.$.notify({
                    	message: "保存成功!"
                    }, {
                    	animate: {
                    		enter: 'animated fadeInRight',
                    		exit: 'animated fadeOutRight'
                    	},
                    	type: 'success'
                    });
                    self.transitionToRoute('dashboard.network.list');
                } else {
                    Ember.$.notify({
                    	title: "<strong>保存失败:</strong>",
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
