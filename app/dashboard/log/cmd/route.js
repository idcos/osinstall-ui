import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "查看设备安装日志",
        isShow:true,
    },
	deviceLogSrv: Ember.inject.service('api/device-log/service'),
  deviceSrv: Ember.inject.service('api/device/service'),
	model: function(params) {
        return Ember.RSVP.hash({
          type:params.type,
        	deviceId:params.deviceId,
			    info:this.get('deviceLogSrv').list(params.deviceId,params.type,"id ASC",0).then(function(data){return data.Content;}),
          device:this.get('deviceSrv').getFull(params.deviceId).then(function(data){return data.Content;}),
        });
    },
    setupController: function(controller, model) {
    	var str = "";
      var maxID = 0;
      if(model.info !== null){
    	 Object.keys(model.info).forEach(function (key) {
          var re = /^[0-9]*]*$/;
          if(re.test(key)){
          	var row = model.info[key];
            maxID = row.ID;
          	str += row.CreatedAt + ": " + row.Title;
          	if(key !== (model.info.length-1)){
          		str += "\n";
          	}
          }
        });
      }
      model.cmd = str;
      if(!Ember.isEmpty(str)){
        controller.set("logContent",str);
      }
      if(maxID > 0){
        controller.set("maxID",maxID);
      }
      
    	controller.set("type",model.type);
      controller.set("deviceId",model.deviceId);
      controller.set("model",model);
      if(!Ember.isEmpty(model.device) && model.device.Status === "installing"){
        controller.send("autoRefreshAction");
      }
    },
    deactivate: function() {
      clearInterval(this.get('controller').get('autoRefreshLogTimer'));
      this.get('controller').set("autoRefreshLogTimer",null);
  }
});
