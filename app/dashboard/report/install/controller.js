import Ember from 'ember';

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),

	actions:{
		reportAction: function(id) {
            var self = this;
            	self.get("deviceSrv").reportInstallReport().then(function(data) {
                    if(data.Status === "success"){
                        Ember.$.notify({
                        	message: "操作成功!"
                        }, {
                        	animate: {
                        		enter: 'animated fadeInRight',
                        		exit: 'animated fadeOutRight'
                        	},
                        	type: 'success'
                        });
                    } else {
                        Ember.$.notify({
                        	title: "<strong>操作成功:</strong>",
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
