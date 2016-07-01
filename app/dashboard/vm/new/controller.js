import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
    deviceSrv: Ember.inject.service('api/device/service'),
	networkSrv: Ember.inject.service('api/network/service'),
	searchForm:{Status:"success",Keyword:null},
	selectAllDevice:true,
	isShowVmBlock:false,
    isShowMultiSearchBlock:false,

    ipChanged: function() {
        var self = this;
        var row = this.get('model.vmInfo');

        set(row,"isShowNetworkInfo",false);
        set(row,"Network",null);
        set(row,"NetworkID",null);

        var regexp =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if(regexp.test(row.Ip)){
            self.get('networkSrv').validateIp(row.Ip).then(function(data){
                if(data.Status === "failure"){
                    set(row,"messageIp","<span class='text-danger'>"+data.Message+"</span>");
                }else if(data.Status === "success"){
                    set(row,"isShowNetworkInfo",true);
                    set(row,"Network",data.Content.Network);
                    set(row,"NetworkID",data.Content.ID);
                    set(row,"messageIp","<span class='text-success'>IP填写正确!</span>");
                }
            });
        }else{
            set(row,"messageIp","<span class='text-danger'>IP格式不正确!</span>");
        }

  }.observes("model.vmInfo.Ip"),

	actions:{
        assignIPAction:function(){
            var self = this;
            var networkId = self.get("model.deviceInfo.NetworkID");
            if(Ember.isEmpty(networkId)){
                Ember.$.notify({
                                    title: "<strong>操作失败:</strong>",
                                    message: "没有可用的宿主机资源!",
                                }, {
                                    animate: {
                                        enter: 'animated fadeInRight',
                                        exit: 'animated fadeOutRight'
                                    },
                                    type: 'danger'
                                });
                return ;
            }
            this.get("networkSrv").getNotUsedIPListByNetworkId(networkId).then(function(response){
                if(response.Status === "success" && response.Content.length > 0){
                    self.set("model.vmInfo.Ip",response.Content[0].Ip);
                }else{
                    Ember.$.notify({
                                    title: "<strong>操作失败:</strong>",
                                    message: "没有可用的IP!",
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
		
		saveVmAction: function(){
            var self = this;
            var vmInfo = self.get("model.vmInfo");
            var model = self.get("model");
            self.set("model.vmInfo.Message","<span class='text-success'>数据正在处理中,请稍候...</span>");
            if(Ember.isEmpty(vmInfo.Hostname) 
                || Ember.isEmpty(vmInfo.Mac) 
                || Ember.isEmpty(vmInfo.Ip) 
                || Ember.isEmpty(vmInfo.OsID) 
                || Ember.isEmpty(vmInfo.CpuCoresNumber)
                || Ember.isEmpty(vmInfo.MemoryCurrent)
                || Ember.isEmpty(vmInfo.DiskSize)
            ){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "请将各信息填写完整!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }
            var form = {};
            form.Sn = vmInfo.Sn;
            form.Hostname = vmInfo.Hostname;
            form.Ip = vmInfo.Ip;
            form.Mac = vmInfo.Mac;
            form.OsID = parseInt(vmInfo.OsID);
            form.SystemID = parseInt(vmInfo.SystemID);
            form.NetworkID = parseInt(vmInfo.NetworkID);
            form.CpuCoresNumber = parseInt(vmInfo.CpuCoresNumber);
            form.MemoryCurrent = parseInt(vmInfo.MemoryCurrent);
            form.DiskSize = parseInt(vmInfo.DiskSize);
            form.AccessToken = model.session.AccessToken
            self.get("vmInstallSrv").create(form).then(function(data) {
                self.set("model.vmInfo.Message",null);
                if(data.Status === "success"){
                    //self.set("model.vmInfo.Message","<span class='text-success'>操作成功!</span>");
                    Ember.$.notify({
                            title: "",
                            message: data.Message,
                        }, {
                        	animate: {
                        		enter: 'animated fadeInRight',
                        		exit: 'animated fadeOutRight'
                        	},
                        	type: 'success'
                        });
                    self.transitionToRoute('dashboard.vm.list','all');
                } else {
                    //self.set("model.vmInfo.Message","<span class='text-danger'>"+data.Message+"</span>");
                    	Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: data.Message,
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
