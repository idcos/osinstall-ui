import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	currentStep: 1,
	nextStep:2,
	lastStep:0,
	isShowMemoryMore:false,
	isShowDiskMore:false,
	isShowingModal: true,
	actions:{
		goToStep: function(step){
            this.set('currentStep', step);
            this.set('nextStep', step+1);
            this.set('lastStep', step-1);
		},
		toggleModal: function() {
      		this.toggleProperty('isShowingModal');
    	},
    	copyHostAction:function(key){
    	  var self = this;
	      var data = this.get("model.vmInfo.Host");
	      var newData = [];
	      self.get("vmInstallSrv").createNewMacAddress().then(function(response) {
                if(response.Status==="success"){
                    for(var i=0;i<data.length;i++){
				      	newData.pushObject(data[i]);
				      	if(i === key){
				      		var row = {};
				      		//row.Hostname = data[i].Hostname;
				      		//row.Ip = data[i].Ip;
				      		row.Os = data[i].Os;
				      		row.Mac = response.Content;
				      		newData.pushObject(row);
				      	}
				      }
				      set(self,"model.vmInfo.Host",newData);
                } else {
                    Ember.$.notify({
                        title: "<strong>保存失败:</strong>",
                        message: response.Message
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
	    cancelHostAction:function(key){
	      var data = this.get("model.vmInfo.Host");
	      var newData = [];
	      for(var i=0;i<data.length;i++){
	      	if(i !== key){
	      		newData.pushObject(data[i]);
	      	}
	      }
	      set(this,'model.vmInfo.Host',newData);
	    },
	    saveAction:function(){
	      var data = this.get("model.vmInfo");
	      console.log(data);
	    },
	}
});
