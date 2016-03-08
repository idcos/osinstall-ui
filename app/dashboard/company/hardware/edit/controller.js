import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
    hardwareSrv: Ember.inject.service('api/hardware/service'),
    isShowRemoveBigItemButton:true,
    actions:{
        copyKeyItemAction:function(key1,key2,key3){
	      var tpl = this.get("model.info.FormatTpl");
	      var data = tpl[key1]['data'][key2];
	      var newData = [];
	      for(var i=0;i<data['data'].length;i++){
	      	newData.pushObject(data['data'][i]);
	      	if(i === key3){
	      		var row = {};
	      		row.name = data['data'][i].name;
	      		row.value = data['data'][i].value;
	      		newData.pushObject(row);
	      	}
	      }
	      set(data,'data',newData);
	    },
	    cancelKeyItemAction:function(key1,key2,key3){
	      var tpl = this.get("model.info.FormatTpl");
	      var data = tpl[key1]['data'][key2];
	      var newData = [];
	      for(var i=0;i<data['data'].length;i++){
	      	if(i !== key3){
	      		newData.pushObject(data['data'][i]);
	      	}
	      }
	      set(data,'data',newData);
	    },
	    copyKeyAction:function(key1,key2){
	      var tpl = this.get("model.info.FormatTpl");
	      var data = tpl[key1];
	      var newData = [];
	      for(var i=0;i<data['data'].length;i++){
	      	newData.pushObject(data['data'][i]);
	      	if(i === key2){
	      		var row = {};
	      		row.name = data['data'][i]["name"];
	      		row.type = data['data'][i]["type"];
	      		var rows = data['data'][i]["data"];
	      		var datas = [];
	      		for(var j=0;j<rows.length;j++){
	      			var currentRow = {};
	      			currentRow.name = rows[j]["name"];
		      		currentRow.value = rows[j]["value"];
		      		datas.pushObject(currentRow);
	      		}
	      		row.data = datas;

	      		if(row.data.length <= 0){
	      			row.data = [{name:"",value:""}];
	      		}
	      		row.tpl = data['data'][i]["tpl"];
	      		row.input = data['data'][i]["input"];
	      		row.default = data['data'][i]["default"];
	      		newData.pushObject(row);
	      	}
	      }
	      set(data,'data',newData);
	    },
	    cancelKeyAction:function(key1,key2){
	      var tpl = this.get("model.info.FormatTpl");
	      var data = tpl[key1];
	      var newData = [];
	      for(var i=0;i<data['data'].length;i++){
	      	if(i !== key2){
	      		newData.pushObject(data['data'][i]);
	      	}
	      }
	      set(data,'data',newData);
	    },
	    copyAction:function(key1){
	      var data = this.get("model.info.FormatTpl");
	      var newData = [];
	      for(var i=0;i<data.length;i++){
	      	newData.pushObject(data[i]);
	      	if(i === key1){
	      		var row = {};
	      		row.name = data[i]["name"];
	      		var rows = data[i]["data"];
	      		var datas = [];
	      		for(var j=0;j<rows.length;j++){
	      			var currentRow = {};
	      			currentRow.name = rows[j]["name"];
		      		currentRow.type = rows[j]["type"];
		      		//currentRow.data = rows[j]["data"];
		      		var rows2 = rows[j]["data"];
		      		var datas2 = [];
		      		if(!Ember.isEmpty(rows2)){
			      		for(var k=0;k<rows2.length;k++){
			      			var currentRow2 = {};
			      			currentRow2.name = rows2[k]["name"];
				      		currentRow2.value = rows2[k]["value"];
				      		datas2.pushObject(currentRow2);
			      		}
			      	}
		      		currentRow.data = datas2;


		      		if(currentRow.data.length <= 0){
		      			currentRow.data = [{name:"",value:""}];
		      		}
		      		currentRow.tpl = rows[j]["tpl"];
		      		currentRow.input = rows[j]["input"];
		      		currentRow.default = rows[j]["default"];
		      		datas.pushObject(currentRow);
	      		}
	      		row.data = datas;
	      		newData.pushObject(row);
	      	}
	      }
	      if(newData.length > 1){
	      	set(this,'isShowRemoveBigItemButton',true);
	      }else{
	      	set(this,'isShowRemoveBigItemButton',false);
	      }
	      set(this,'model.info.FormatTpl',newData);
	    },
	    cancelAction:function(key1){
	      var data = this.get("model.info.FormatTpl");
	      var newData = [];
	      for(var i=0;i<data.length;i++){
	      	if(i !== key1){
	      		newData.pushObject(data[i]);
	      	}
	      }
	      if(newData.length > 1){
	      	set(this,'isShowRemoveBigItemButton',true);
	      }else{
	      	set(this,'isShowRemoveBigItemButton',false);
	      }
	      set(this,'model.info.FormatTpl',newData);
	    },
        saveAction:function(){
            var self = this;
            var tpl = self.get("model.info.FormatTpl");
            var result = [];
            for(var i=0;i<tpl.length;i++) {
                var result2 = {};
                result2.Name = tpl[i].name;
                var data = [];
                if(tpl[i].data !== null && !Ember.isEmpty(tpl[i].data)){
                    var row = tpl[i].data;
                    for(var j=0;j<row.length;j++) {
                    	var row2 = row[j];
                        if(row2.type === "select" && row2.data !== null && !Ember.isEmpty(row2.data)){
	                        /*
	                        //console.log(Ember.get(row2,"default"));
	                        for(var k=0;k<row2.data.length;k++){
	                        	//console.log(row2.data[k].htmlChecked + row2.data[k].value);
	                        	if(row2.data[k].checked === true){
	                        		set(row2,"default",row2.data[k].value);
	                        		//tpl[i].data[j].default = row2.data[k].value;
	                        	}
	                        }
	                        */
                    	}else if(row2.type === "input"){
                    		//tpl[i].data[j].default = row2.tpl.replace(/<{##}>/,row2.input);
                    		set(row2,"default",row2.tpl.replace(/<{##}>/,row2.input));
                    	}
                        var result3 = {};
                        result3.Name = row2.name;
                        result3.Value = tpl[i].data[j].default;
                        data.pushObject(result3);
                    }
                }
                result2.Data = data;
                result.pushObject(result2);
            }
            
            var data2 = JSON.stringify(result);
            var form = this.get("model.info");
            form.Data = data2;
            form.IsSystemAdd = "Yes";
            form.Tpl = JSON.stringify(tpl);

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
                    self.transitionToRoute('dashboard.company.hardware.list');
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
