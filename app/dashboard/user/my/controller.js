import Ember from 'ember';

export default Ember.Controller.extend({
	userSrv: Ember.inject.service('api/user/service'),
	actions:{
		saveAction: function() {
			var self = this;
        	var form = this.get("model.info");
        	self.get("userSrv").updateMyInfo(form).then(function(data) {
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
                    //self.transitionToRoute('dashboard.user.list');
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
