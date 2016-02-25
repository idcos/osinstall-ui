import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
	page:1,
	pageCount:1,
	pageSize:7,
	form:{Status:null,Keyword:null},
    selectAll:false,//是否全选
    isShowMultiSearchBlock:false, //是否显示复杂查询区块

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

    CompanyChange: function() {
      var self = this;
      var company = this.get('form.Company');
      self.set('model.modelNameData', null);
      self.set('form.Product', null);
      self.set('form.ModelName', null);
      var form = {};
      form.Company = company;
        this.get("deviceSrv").scanProductList(form).then(function(data){
            self.set('model.productData', data.Content);
        });
    }.observes("form.Company"),

    ProductChange: function() {
      var self = this;
      var company = this.get('form.Company');
      var product = this.get('form.Product');
      self.set('model.modelNameData', null);
      self.set('form.ModelName', null);
      var form = {};
      form.Company = company;
      form.Product = product;
        this.get("deviceSrv").scanModelNameList(form).then(function(data){
            self.set('model.modelNameData', data.Content);
        });
    }.observes("form.Product"),

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
        },
        searchAction:function(){
            this.send("pageChanged",this.get("page"));
        },
        pageChanged:function(page){
            var self = this;
            this.set("page",page);
            var pageSize = this.get("pageSize");
            var form = this.get("form");
            this.get("deviceSrv").scanList(pageSize,(page-1)*pageSize,form).then(function(data){
                self.set('rowList', data.Content.list);
                var pageCount = Math.ceil(data.Content.recordCount/pageSize);
                if(pageCount <= 0){
                    pageCount = 1;
                }
                self.set('pageCount',pageCount);
            });
        },
        queryCompanyAction:function(){
            var self = this;
            this.get("deviceSrv").scanCompanyList().then(function(data){
                if(data.Status === "success"){
                    self.set('model.companyData',data.Content);
                }
            });
        },
        exportAction:function(value){
            var self = this;

            if(value === "select"){
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
            }

            var url = "?method=get";
            
            if(value === "select"){
                ids = ids.join(",");
                url += "&ids="+ids;
            }

            var form = self.get("form");
            if(!Ember.isEmpty(form.Keyword)){
                url += "&Keyword="+encodeURI(form.Keyword);
            }
            if(!Ember.isEmpty(form.Company)){
                url += "&Company="+form.Company;
            }
            if(!Ember.isEmpty(form.Product)){
                url += "&Product="+form.Product;
            }
            if(!Ember.isEmpty(form.ModelName)){
                url += "&ModelName="+form.ModelName;
            }
            if(!Ember.isEmpty(form.CpuRule)){
                url += "&CpuRule="+form.CpuRule;
            }
            if(!Ember.isEmpty(form.Cpu)){
                url += "&Cpu="+form.Cpu;
            }
            if(!Ember.isEmpty(form.MemoryRule)){
                url += "&MemoryRule="+form.MemoryRule;
            }
            if(!Ember.isEmpty(form.Memory)){
                url += "&Memory="+form.Memory;
            }
            if(!Ember.isEmpty(form.DiskRule)){
                url += "&DiskRule="+form.DiskRule;
            }
            if(!Ember.isEmpty(form.Disk)){
                url += "&Disk="+form.Disk;
            }
            this.get("deviceSrv").exportScanDevice(url);
        },
    }
});
