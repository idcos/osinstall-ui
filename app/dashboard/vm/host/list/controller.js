import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	vmHostSrv: Ember.inject.service('api/vm-host/service'),
    networkSrv: Ember.inject.service('api/network/service'),
    userSrv: Ember.inject.service('api/user/service'),
	page:1,
	pageCount:1,
	pageSize:20,
	form:{Status:"success",OsID:null,HardwareID:null,SystemID:null,Keyword:null,BatchNumber:null},
	isShowMultiSearchBlock:false, //是否显示复杂查询区块
	isShowInstallInfoCol:false,
    selectAll:false,//是否全选

	actions:{
		showMultiSearchBlockAction:function(){
			set(this,'isShowMultiSearchBlock',true);
		},
		hideMultiSearchBlockAction:function(){
			set(this,'isShowMultiSearchBlock',false);
		},
		queryAction:function(form){
			this.set('form',form);
			this.send("pageChanged",this.get("page"));
            var self = this;
            self.send("pageChanged",self.get("page"));
		},
		searchAction:function(){
			this.send("pageChanged",1);
		},
        pageSizeChanged:function(pageSize){
            this.set("pageSize",pageSize);
            this.send("pageChanged",this.get("page"));
        },
		pageChanged:function(page){
			var self = this;
			this.set("page",page);
			var pageSize = this.get("pageSize");
			var form = this.get("form");

			this.get("vmHostSrv").list(pageSize,(page-1)*pageSize,form).then(function(data){
                self.set('rowList', data.Content.list);
                var pageCount = Math.ceil(data.Content.recordCount/pageSize);
                if(pageCount <= 0){
                	pageCount = 1;
                }
                self.set('pageCount',pageCount);
            });
		},
		updateVmHostResourceAction:function(){
			var self = this;
			self.set("model.messageUpdateVmHost","<img src='image/loading.gif' />更新中,请稍候");
			self.get("vmHostSrv").updateVmHostResource().then(function(data) {
				self.set("model.messageUpdateVmHost",null);
                if(data.Status === "success"){
                    Ember.$.notify({
                            message: "操作成功!"
                        }, {
                        	animate: {
                        		enter: 'animated fadeInRight',
                        		exit: 'animated fadeOutRight'
                        	},
                        	type: 'success'
                        });
                    self.send("pageChanged",self.get("page"));
                } else {
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
