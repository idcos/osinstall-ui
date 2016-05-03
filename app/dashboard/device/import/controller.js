import Ember from 'ember';
import uploadFn from 'ui/utils/file-uploader';
import ajaxUploadFile from 'ui/components/common/io-file-upload/ajax-file-upload';

export default Ember.Controller.extend({
	actions:{
		saveAction:function(){
			var self = this;
			var files = $('.file-uploader')[0].files;

               if(!Ember.isEmpty(files) && files.length <= 0){
                    Ember.$.notify({
                              title: "<strong>上传失败:</strong>",
                              message: "请选择上传文件！"
                         }, {
                              animate: {
                                   enter: 'animated fadeInRight',
                                   exit: 'animated fadeOutRight'
                              },
                              type: 'danger'
                         });
                    return ;
               }

               ajaxUploadFile({
                    url: '/api/osinstall/v1/device/upload',
                    fileElement: $('.file-uploader')[0],
                    onStart() {
                         //console.log('onStart');
                    },
                    onSuccess(response) {
                         var data = $.parseJSON(response);
                         if(data.Status === "success"){
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
                    },
                    onError(err) {
                         Ember.$.notify({
                                   title: "<strong>上传失败:</strong>",
                                   message: err
                              }, {
                                   animate: {
                                        enter: 'animated fadeInRight',
                                        exit: 'animated fadeOutRight'
                                   },
                                   type: 'danger'
                              });
                    }
               });
               
               /*
			uploadFn(files, '/api/osinstall/v1/device/upload', 'json').then(function(data) {
                    //console.log(data);
     			if(data.Status === "success"){
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
               */
		},
	}
});
