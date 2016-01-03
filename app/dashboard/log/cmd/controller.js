import Ember from 'ember';

export default Ember.Controller.extend({
	deviceLogSrv: Ember.inject.service('api/device-log/service'),
	deviceId:null,//设备ID
	type:null,//日志类ing
	maxID:0,//最后查询到的增量ID
	autoRefreshLogTimer:null,
    autoRefreshLogTime:1000,
    loadingStrLength:0,
    loadingStr:"",
    logContent:"",
	actions:{
		showMoreTplMenuAction:function(){
			var isShowMoreTplMenu = this.get('isShowMoreTplMenu');
			if(isShowMoreTplMenu){
				set(this,'isShowMoreTplMenu',false);
			}else{
				set(this,'isShowMoreTplMenu',true);
			}
		},
		autoRefreshAction:function(){
            var self = this;
            this.set('autoRefreshLogTimer', setInterval(function() {
            	self.send("queryAction");
            }, self.get("autoRefreshLogTime")));
		},
		queryAction:function(){
            var self = this;
            self.get('deviceLogSrv').list(self.get("deviceId"),self.get("type"),"id ASC",self.get("maxID")).then(function(data){
            	var info = data.Content;
            	var str = self.get("logContent");
            	var loadingStrLength = self.get("loadingStrLength");
            	if(info !== null){
            		var maxID = self.get("maxID");
            		if(!Ember.isEmpty(str)){
            			str += "\n";
            		}
			    	Object.keys(info).forEach(function (key) {
			          var re = /^[0-9]*]*$/;
			          if(re.test(key)){ 	
			          	var row = info[key];
			            maxID = row.ID;
			          	str += row.CreatedAt + ": " + row.Title;
			          	if(parseInt(key) !== (info.length-1)){
			          		str += "\n";
			          	}
			          }
			        });
			        self.set("maxID",maxID);
			        self.set("logContent",str);
			        loadingStrLength = 0;
      			}else{
      				loadingStrLength++;
      			}

      			if(loadingStrLength > 6){
      				loadingStrLength = 0;
      			}
      			self.set("loadingStrLength",loadingStrLength);

      			var loadingStr = "";
      			for(var i=1;i<=loadingStrLength;i++){
      				loadingStr += ".";
      			}
      			str += loadingStr;
      			self.set("model.cmd",str);
            });
           

		},
	}
});
