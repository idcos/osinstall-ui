import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
    hardwareSrv: Ember.inject.service('api/hardware/service'),
    actions:{
        inputChangeAction:function(value){
            var self = this;
            var tpl = self.get("model.info.FormatTpl");
            if(tpl !== null && !Ember.isEmpty(tpl)){
                for(var i=0;i<tpl.length;i++) {
                    if(tpl[i].data !== null && !Ember.isEmpty(tpl[i].data)){
                        var row = tpl[i].data;
                        for(var j=0;j<row.length;j++) {
                            var row2 = row[j];
                            if(row2.type === "input"){
                                var input = row2.tpl.replace(/<{##}>/,row2.input);
                                set(row2,"default",input);
                            }
                        }
                    }
                }
            }
        },

        selectInputChangeAction:function(value){
            var self = this;
            var tpl = self.get("model.info.FormatTpl");
            for(var i=0;i<tpl.length;i++) {
                var data = tpl[i].data;
                for(var j=0;j<data.length;j++) {
                    var row = data[j];
                    if(row.type === "select" && row.value === value && row.value !== row.default){
                        for(var k=0;k<row.data.length;k++){
                            var item = row.data[k];
                            if(row.default === item.value){
                                set(item,"value",row.value);
                                set(row,"default",row.value);
                            }
                        }
                    }
                }
            }
        },

        selectChangeAction:function(value){
            var self = this;
            var tpl = self.get("model.info.FormatTpl");
            for(var i=0;i<tpl.length;i++) {
                var data = tpl[i].data;
                for(var j=0;j<data.length;j++) {
                    var row = data[j];
                    if(row.default !== row.value){
                        set(row,"value",row.default);
                    }
                }
            }
        },

        deleteItemAction:function(key){
            var self = this;
            var tpl = self.get("model.info.FormatTpl");
            var rows = [];
            for(var i=0;i<tpl.length;i++) {
                if(i !== key){
                    rows.pushObject(tpl[i]);
                }
            }
            if(rows.length > 1){
                self.set('model.isShowDeleteItemButton',true);
            }else{
                self.set('model.isShowDeleteItemButton',false);
            }
            self.set('model.info.FormatTpl',rows);
        },
        saveAction:function(){
            var self = this;
            var result = [];
            var tpl = self.get("model.info.FormatTpl");
            for(var i=0;i<tpl.length;i++) {
                var result2 = {};
                result2.Name = tpl[i].name;
                var data = [];
                if(tpl[i].data !== null && !Ember.isEmpty(tpl[i].data)){
                    var row = tpl[i].data;
                    for(var j=0;j<row.length;j++) {
                        var row2 = row[j];
                        delete row2.value;

                        var result3 = {};
                        result3.Name = row2.name;
                        result3.Value = row2.default;
                        data.pushObject(result3);
                    }
                }
                result2.Data = data;
                result.pushObject(result2);
            }

            var data = JSON.stringify(result);
            var form = this.get("model.info");
            form.Data = data;
            form.Tpl = JSON.stringify(form.FormatTpl);
            form.Status = "Success";

            self.get("hardwareSrv").update(form).then(function(data) {
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
                    self.transitionToRoute('dashboard.hardware.list');
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
