import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "平台数据报表",
        isShow:true,
    },
	deviceSrv: Ember.inject.service('api/device/service'),
	model: function(params) {
        return Ember.RSVP.hash({
			report:this.get('deviceSrv').getInstallReport().then(function(data){return data;}),
		});
    },

    setupController: function(controller, model) {
    	var companyData = [];
    	var osData = [];
    	if(model.report.Status === "success"){
        	 controller.set("report",model.report.Content);
             var data = model.report.Content;
             if(!Ember.isEmpty(data.CompanyReport)){
	             for(var i=0;i<data.CompanyReport.length;i++){
	             	var row = {};
                    if(Ember.isEmpty(data.CompanyReport[i].ProductName)){
                        data.CompanyReport[i].ProductName = "无厂商";
                    }
	             	row.value = data.CompanyReport[i].Count;
	             	row.name = data.CompanyReport[i].ProductName+"("+data.CompanyReport[i].Count+")";
	             	companyData.pushObject(row);
	             }
             }

             if(!Ember.isEmpty(data.OsReport)){
	             for(var i=0;i<data.OsReport.length;i++){
	             	var row = {};
	             	row.value = data.OsReport[i].Count;
	             	row.name = data.OsReport[i].OsName+"("+data.OsReport[i].Count+")";
	             	osData.pushObject(row);
	             }
             }
        }
        model.companyData = JSON.stringify(companyData);
        model.osData = JSON.stringify(osData);
        controller.set("model",model);
    }
});