import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "装机统计报表",
        isShow:true,
    },
	deviceSrv: Ember.inject.service('api/device/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			report:this.get('deviceSrv').getInstallReport().then(function(data){return data;}),
		});
    },

    setupController: function(controller, model) {
    	if(model.report.Status === "success"){
        	 controller.set("report",model.report.Content);
             var data = model.report.Content;
             var str = '累计安装 '+ data.Count + '台/次';
             if(data.Count > 0 && data.ProductReport.length > 0){
                str += "\n\n设备厂商:\n";
                for(var i=0;i<data.ProductReport.length;i++){
                    if(Ember.isEmpty(data.ProductReport[i].ProductName)){
                        data.ProductReport[i].ProductName = '无厂商信息';
                    }
                    str += data.ProductReport[i].ProductName + ' ' + data.ProductReport[i].Count + "台/次\n";
                }
             }
             if(data.Count > 0 && data.OsReport.length > 0){
                str += "\n\n操作系统:\n";
                for(var i=0;i<data.OsReport.length;i++){
                    str += data.OsReport[i].OsName + ' ' + data.OsReport[i].Count + "台/次\n";
                }
             }

             if(data.Count > 0 && data.HardwareReport.length > 0){
                str += "\n\n硬件配置模板:\n";
                for(var i=0;i<data.HardwareReport.length;i++){
                    if(Ember.isEmpty(data.HardwareReport[i].HardwareName)){
                        data.HardwareReport[i].HardwareName = '无模板信息';
                    }
                    str += data.HardwareReport[i].HardwareName + ' ' + data.HardwareReport[i].Count + "台/次\n";
                }
             }
             controller.set("strReport",str);
        }else{
        	Ember.$.notify({
            	title: "<strong>操作失败:</strong>",
                message: model.report.Message
            }, {
            	animate: {
            		enter: 'animated fadeInRight',
                	exit: 'animated fadeOutRight'
            	},
                type: 'danger'
            });
        }
    }
});