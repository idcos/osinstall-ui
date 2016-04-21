import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "添加硬件配置",
        isShow:true,
    },
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function(params) {
        if(params.id === "new"){
            return {info:{}};
        }else{
            return Ember.RSVP.hash({
                id:params.id,
                companyData:[{name:"Dell"},{name:"惠普"},{name:"IBM"},{name:"联想"},{name:"华为"},{name:"浪潮"},{name:"H3C"},{name:"宝德"}],
                info:this.get('hardwareSrv').get(params.id).then(function(data){return data.Content;}),
            });
        }
    },

    setupController: function(controller, model) {
    	model.info.FormatTpl = $.parseJSON(model.info.Tpl);
        if(!Ember.isEmpty(model.info.FormatTpl)){
            for(var i=0;i<model.info.FormatTpl.length;i++){
                if(!Ember.isEmpty(model.info.FormatTpl[i].data)){
                    for(var j=0;j<model.info.FormatTpl[i].data.length;j++){
                        model.info.FormatTpl[i].data[j].value = model.info.FormatTpl[i].data[j].default;
                    }
                }
            }
        }
        if(!Ember.isEmpty(model.info.FormatTpl) && model.info.FormatTpl.length > 1){
            model.isShowDeleteItemButton = true;
        }else{
            model.isShowDeleteItemButton = false;
        }
    	controller.set("model",model);
    }
});
