import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	page:1,
	pageCount:1,
	pageSize:20,
    Company:null,
    Product:null,
    ModelName:null,
    IsSystemAdd:"Yes",
    selectAll:false,//是否全选

    CompanyChange: function() {
      var self = this;
      var company = this.get('Company');
      self.set('model.modelNameData', null);
      self.set('Product', null);
      self.set('ModelName', null);
        this.get("hardwareSrv").getModelNameByCompanyAndGroup(company,'Yes').then(function(data){
            self.set('model.modelNameData', data.Content);
        });
    }.observes("Company"),

    selectAllChange: function() {
            var self = this;
            var selectAll = this.get('selectAll');
            var rowList = this.get("rowList");
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    set(row,"checked",selectAll); 
                }
            });
    }.observes("selectAll"),

    ProductChange: function() {
      var self = this;
      var company = this.get('Company');
      var product = this.get('Product');
        this.get("hardwareSrv").getModelNameByCompanyAndProductAndGroup(company,product,'Yes').then(function(data){
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
            var isSystemAdd = this.get('IsSystemAdd');

			this.get("hardwareSrv").list(pageSize,(page-1)*pageSize,company,product,modelName,isSystemAdd).then(function(data){
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
                        self.CompanyChange();
                        self.ProductChange();
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
        exportSelectedAction: function() {
            var self = this;
            var rowList = self.get("rowList");
            var ids = [];
            for(var i=0;i<rowList.length;i++){
                var row = rowList[i];
                if(row.checked === true){
                    ids.push(row.ID);
                }
            }

            if(ids.length === 0){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "请先选中要导出的项!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            var url = "?method=get";
            ids = ids.join(",");
            url += "&ids="+ids;
            self.get("hardwareSrv").exportHardware(url);
            return ;
        },

        exportAction: function() {
            var self = this;
            var url = "?method=get";
            var company = this.get('Company');
            var product = this.get('Product');
            var modelName = this.get('ModelName');
            if(!Ember.isEmpty(company)){
                url += "&company="+company;
            }
            if(!Ember.isEmpty(product)){
                url += "&product="+product;
            }
            if(!Ember.isEmpty(modelName)){
                url += "&modelName="+modelName;
            }
            self.get("hardwareSrv").exportHardware(url);
            return ;
        },
	}
});
