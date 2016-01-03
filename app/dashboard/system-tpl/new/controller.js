import Ember from 'ember';

export default Ember.Controller.extend({
	systemConfigSrv: Ember.inject.service('api/system-config/service'),
	actions:{
		addAction: function() {
			var self = this;
        	var form = this.get("model.info");
        	self.get("systemConfigSrv").create(form).then(function(data) {
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
                    self.transitionToRoute('dashboard.systemTpl.list');
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
