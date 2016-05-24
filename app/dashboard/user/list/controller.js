import Ember from 'ember';

export default Ember.Controller.extend({
	userSrv: Ember.inject.service('api/user/service'),
	page:1,
	pageCount:1,
	pageSize:20,

	actions:{
		queryAction:function(){
			this.send("pageChanged",this.get("page"));
		},
		pageChanged:function(page){
			var self = this;
			this.set("page",page);
			var pageSize = this.get("pageSize");
            var form = this.get("model.form");
            var model = this.get("model");
            form.AccessToken = model.session.AccessToken;

			this.get("userSrv").list(pageSize,(page-1)*pageSize,form).then(function(data){
                if(data.Status !== "success"){
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

                self.set('rowList', data.Content.list);
                var pageCount = Math.ceil(data.Content.recordCount/pageSize);
                if(pageCount <= 0){
                	pageCount = 1;
                }
                self.set('pageCount',pageCount);
            });
		},
		deleteAction: function(id) {
            if(confirm("确认删除吗？")){
    			var self = this;
                var model = this.get("model");
                var accessToken = model.session.AccessToken;
            	self.get("userSrv").deleteRowById(id,accessToken).then(function(data) {
                    if(data.Status==="success"){
                        Ember.$.notify({
                        	message: "删除成功!"
                        }, {
                        	animate: {
                        		enter: 'animated fadeInRight',
                        		exit: 'animated fadeOutRight'
                        	},
                        	type: 'success'
                        });
                        //self.transitionToRoute('dashboard.os.list');
                        self.send("pageChanged",self.get("page"));
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
            }
        },
	}
});
