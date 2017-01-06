import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
    deviceSrv: Ember.inject.service('api/device/service'),
    selectAllChange: function() {
            var self = this;
            var selectAll = this.get('model.selectAll');
            var rowList = this.get("model.rowList");
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.ImportStatus !== "Error"){
                        set(row,"checked",selectAll);
                    }
                }
            });
            self.updateSelectCount();
    }.observes("model.selectAll"),

    checkboxCheckedChanged: function() {
        var self = this;
        self.updateSelectCount();
    }.observes("model.rowList.@each.checked"),

    updateSelectCount:function(){
            var self = this;
            var rowList = self.get("model.rowList");
            var num = 0;
            if(!Ember.isEmpty(rowList)){
                for(var i=0;i<rowList.length;i++){
                    var row = rowList[i];
                    if(row.checked === true){
                        num++;
                    }
                }
            }
            self.set("model.selectCount",num);
    },

    actions:{
        queryAction:function(){
            this.send("pageChanged",this.get("model.page"));
        },
        pageSizeChanged:function(pageSize){
            this.set("model.pageSize",pageSize);
            this.send("model.pageChanged",this.get("model.page"));
        },
        pageChanged:function(page){
            var self = this;
            this.set("model.page",page);
            var pageSize = this.get("model.pageSize");
            var file = this.get("model.id");
            this.get("deviceSrv").getImportPriview(file,pageSize,(page-1)*pageSize).then(function(data){
                if(!Ember.isEmpty('success')){
                    var rows = data.Content;
                    if(!Ember.isEmpty(rows)){
                        for(var i=0;i<rows.length;i++){
                            if(rows[i].ImportStatus === "Error"){
                                rows[i].checked = false;
                            }else if(rows[i].ImportStatus === "Notice"){
                                rows[i].checked = false;
                            }else{
                                rows[i].checked = true;
                            }
                        }
                    }
                    self.set('model.rowList', rows);
                    var pageCount = Math.ceil(data.recordCount/pageSize);
                    if(pageCount <= 0){
                        pageCount = 1;
                    }
                    self.set('model.pageCount',pageCount);
                    self.set('model.recordCount',data.recordCount);
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
            var form = {};
            form.Filename = file;
            var rowList = this.get("model.rowList");
            var sn = [];
            for(var i=0;i<rowList.length;i++){
                if(rowList[i].checked === true){
                    sn.push(rowList[i].Sn);
                }
            }
            if(sn.length <= 0){
                Ember.$.notify({
                            title: "<strong>操作失败:</strong>",
                            message: "请选中要操作的设备!"
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'danger'
                        });
                return ;
            }
            form.Sns = sn;
            self.get("deviceSrv").importDevice(form).then(function(data) {
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
