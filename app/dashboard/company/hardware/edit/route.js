import Ember from 'ember';

import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "修改设备型号",
        isShow:true,
    },
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
            companyData:[{name:"Dell"},{name:"惠普"},{name:"IBM"},{name:"联想"},{name:"华为"},{name:"浪潮"},{name:"H3C"},{name:"宝德"}],
			typeData:[{name:"下拉框",value:"select"},{name:"输入框",value:"input"}],
			info:this.get('hardwareSrv').get(params.id).then(function(data){return data.Content;}),
            statusData:[{id:"Pending",name:"待审核"},{id:"Success",name:"审核成功"},{id:"Failure",name:"审核失败"}],
		});
    },

    setupController: function(controller, model) {
    	model.info.FormatTpl = $.parseJSON(model.info.Tpl);
    	var data = model.info.FormatTpl;
    	if(data !== null){
    		for(var i=0;i<data.length;i++){
    			if(!Ember.isEmpty(data[i]['data'])){
    				for(var j=0;j<data[i]['data'].length;j++){
    					var row1 = data[i]['data'][j];
    					if(row1['type'] === "select" && !Ember.isEmpty(row1['data'])){
		    				for(var k=0;k<row1['data'].length;k++){
		    					var row = row1['data'][k];
		    					if(row.value === row1.default){
		    						//data[i]['data'][j]['data'][k].checked = true;
		    					}else{
		    						//data[i]['data'][j]['data'][k].checked = false;
		    					}
		    				}
		    			}
    				}
    			}
    		}
    	}
    	model.info.FormatTpl = data;
    	//console.log(model);
    	controller.set("model",model);
    }
});