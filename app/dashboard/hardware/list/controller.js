import Ember from 'ember';

export default Ember.Controller.extend({
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	page:1,
	pageCount:1,
	pageSize:20,
    Company:null,
    Product:null,
    ModelName:null,

    CompanyChange: function() {
      var self = this;
      var company = this.get('Company');
      self.set('model.modelNameData', null);
      self.set('Product', null);
      self.set('ModelName', null);
        this.get("hardwareSrv").getModelNameByCompanyAndGroup(company,'').then(function(data){
            self.set('model.modelNameData', data.Content);
        });
    }.observes("Company"),

    ProductChange: function() {
      var self = this;
      var company = this.get('Company');
      var product = this.get('Product');
        this.get("hardwareSrv").getModelNameByCompanyAndProductAndGroup(company,product).then(function(data){
            self.set('model.modelNameData', data.Content);
        });
    }.observes("Product"),

	actions:{
		queryAction:function(){
			this.send("pageChanged",this.get("page"));
		},
        searchAction:function(){
            this.send("pageChanged",1);
        },
		pageChanged:function(page){
			var self = this;
			this.set("page",page);
			var pageSize = this.get("pageSize");

            var company = this.get('Company');
            var product = this.get('Product');
            var modelName = this.get('ModelName');

			this.get("hardwareSrv").list(pageSize,(page-1)*pageSize,company,product,modelName,"").then(function(data){
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
            	self.get("hardwareSrv").deleteRowById(id).then(function(data) {
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
        checkOnlineUpdateAction:function(){
            var self = this;
            this.get('hardwareSrv').checkOnlineUpdate().then(function(data){
                self.set('model.isLastestVersion',false);
                if(data.Status === 'success'){
                    if(!Ember.isEmpty(data.Content) && data.Content.length > 0){
                        var versions = data.Content;
                        var lastestVersion = versions[versions.length-1];
                        self.set('model.lastestVersion',lastestVersion);
                    }else{
                        self.set('model.lastestVersion',null);
                    }

                    if(Ember.isEmpty(data.Content) && Ember.isEmpty(data.Message)){
                        self.set('model.isLastestVersion',true);
                    }

                    if(!Ember.isEmpty(data.CurrentVersion)){
                        self.set('model.currentVersion',data.CurrentVersion);
                    }
                    self.set('model.versionMessage',data.Message);
                }else{
                    self.set('model.lastestVersion',null);
                    self.set('model.currentVersion',null);
                }
            });
        },
        onlineUpdateAction: function(id) {
                var self = this;
                self.get("hardwareSrv").runOnlineUpdate().then(function(data) {
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
                        window.setTimeout(function(){
                            self.send("checkOnlineUpdateAction");
                        }, 500);
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
