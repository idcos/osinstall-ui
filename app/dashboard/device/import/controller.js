import Ember from 'ember';
import uploadFn from 'ui/utils/file-uploader';

export default Ember.Controller.extend({
	actions:{
		saveAction:function(){
			var self = this;
			var files = $('.file-uploader')[0].files;
			uploadFn(files, '/api/osinstall/v1/device/upload', 'json').then(function(data) {
                    //console.log(data);
     			if(data.Status === "success"){
                         /*
                         Ember.$.notify({
                         	message: "上传成功!"
                         }, {
                         	animate: {
                         		enter: 'animated fadeInRight',
                         		exit: 'animated fadeOutRight'
                         	},
                         	type: 'success'
                         });
                         */
                         self.transitionToRoute('dashboard.device.importPriview',data.Content.result);
                     } else {
                         Ember.$.notify({
                         	title: "<strong>上传失败:</strong>",
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
