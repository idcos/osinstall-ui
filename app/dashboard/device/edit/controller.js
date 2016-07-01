import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
  networkSrv: Ember.inject.service('api/network/service'),
	manageNetworkSrv: Ember.inject.service('api/manageNetwork/service'),
	deviceSrv: Ember.inject.service('api/device/service'),
	isMultiDevice:false,//是否录入多个设备
	isShowNetworkInfo:false,//是否显示网段信息
	ip:null,
  LocationID:null,

	ipChange: function() {
      var self = this;
      var ip = this.get('ip');
      if(!Ember.isEmpty(ip)){
        set(this,"isShowNetworkInfo",true);
      }else{
        set(this,"isShowNetworkInfo",false);
      }
  	}.observes("ip"),

  	ipChanged: function() {
        var self = this;
        var rows = this.get('rows');

        function eachFunction(row){
        	var regexp =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;   
    			if(regexp.test(row.Ip)){
    				self.get('networkSrv').validateIp(row.Ip).then(function(data){
  	        		if(data.Status === "failure"){
  	        			set(row,"messageIp","<span class='text-danger'>"+data.Message+"</span>");
  	        		}else if(data.Status === "success"){
  	        			set(row,"isShowNetworkInfo",true);
  	        			set(row,"Network",data.Content.Network);
  	        			set(row,"NetworkID",data.Content.ID);
  	        			set(row,"messageIp","<span class='text-success'>IP填写正确!</span>");
  	        		}
  	        	});
    			}else{
    				set(row,"messageIp","<span class='text-danger'>IP格式不正确!</span>");
    			}
        }

        for (var i=0;i<rows.length;i++) {
        	var row = rows[i];
          
        	set(row,"isShowNetworkInfo",false);
        	set(row,"Network",null);
        	set(row,"NetworkID",null);

          if(!Ember.isEmpty(row.Ip)){
         		eachFunction(row);
          }else{
            	set(row,"isShowNetworkInfo",false);
          }
        }
  }.observes("rows.@each.Ip"),


  manageIpChanged: function() {
        var self = this;
        var rows = this.get('rows');

        function eachFunction(row){
          var regexp =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;   
          if(regexp.test(row.ManageIp)){
            self.get('manageNetworkSrv').validateIp(row.ManageIp).then(function(data){
                if(data.Status === "failure"){
                  set(row,"messageManageIp","<span class='text-danger'>"+data.Message+"</span>");
                }else if(data.Status === "success"){
                  set(row,"isShowManageNetworkInfo",true);
                  set(row,"ManageNetwork",data.Content.Network);
                  set(row,"ManageNetworkID",data.Content.ID);
                  set(row,"messageManageIp","<span class='text-success'>IP填写正确!</span>");
                }
              });
          }else{
            set(row,"messageManageIp","<span class='text-danger'>IP格式不正确!</span>");
          }
        }

        for (var i=0;i<rows.length;i++) {
          var row = rows[i];
          
          set(row,"isShowManageNetworkInfo",false);
          set(row,"ManageNetwork",null);
          set(row,"ManageNetworkID",null);

          if(!Ember.isEmpty(row.ManageIp)){
            eachFunction(row);
          }else{
              set(row,"isShowManageNetworkInfo",false);
          }
        }
  }.observes("rows.@each.ManageIp"),

  snChanged: function() {
        var self = this;
        var rows = this.get('rows');

        function eachFunction(row){ 
            var isError = false;
            set(row,"IsVm",null);
            if(isError === false){
              self.get('deviceSrv').validateSn(row.Sn).then(function(data){
                  if(!Ember.isEmpty(data.Content.IsVm)){
                    set(row,"IsVm",data.Content.IsVm);
                  }
              });
            }
        }

        for (var i=0;i<rows.length;i++) {
          var row = rows[i];
          if(!Ember.isEmpty(row.Sn)){
            eachFunction(row);
          }
        }
  }.observes("rows.@each.Sn"),

	actions:{
		saveAction:function(){
			var self = this;
        	var form = this.get("rows");
        	self.get("deviceSrv").batchUpdate(form).then(function(data) {
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
                    self.transitionToRoute('dashboard.device.list',"all");
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
		addDeviceAction:function(){
			var rows = this.get('rows');
			var data = {};
			data.id = rows.length;
			rows.pushObject(data);
			set(this,'rows',rows);
			if(rows.length > 1){
				set(this,'isMultiDevice',true);
			}else{
				set(this,'isMultiDevice',false);
			}
      /*
			var height = document.body.scrollHeight;
			window.scrollTo(0,height);
      */
		},
    toggleModal: function() {
      this.toggleProperty('isShowingModal');
    },
	}
});
