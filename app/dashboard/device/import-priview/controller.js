import Ember from 'ember';

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	page:1,
	pageCount:1,
	pageSize:20,

	actions:{
		queryAction:function(){
			this.send("pageChanged",this.get("page"));
		},
        pageSizeChanged:function(pageSize){
            this.set("pageSize",pageSize);
            this.send("pageChanged",this.get("page"));
        },
		pageChanged:function(page){
			var self = this;
			this.set("page",page);
			var pageSize = this.get("pageSize");
			var file = this.get("model.id");
			this.get("deviceSrv").getImportPriview(file,pageSize,(page-1)*pageSize).then(function(data){
                if(!Ember.isEmpty('success')){
                    self.set('rowList', data.Content);
                    self.set('status', data.Status);
                    var pageCount = Math.ceil(data.recordCount/pageSize);
                    if(pageCount <= 0){
                    	pageCount = 1;
                    }
                    self.set('pageCount',pageCount);
                }else{
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
		importAction:function(){
			var self = this;
			var file = this.get("model.id");
			self.get("deviceSrv").importDevice(file).then(function(data) {
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
                        self.transitionToRoute('dashboard.device.list',"all");
                        //console.log("success");
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
