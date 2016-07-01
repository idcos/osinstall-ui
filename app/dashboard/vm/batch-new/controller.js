import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
	deviceSrv: Ember.inject.service('api/device/service'),
	searchForm:{Status:"success",Keyword:null},
	selectAllDevice:true,
	isShowVmBlock:false,
    isShowMultiSearchBlock:false,

	selectAllDeviceChange: function() {
            var self = this;
            var selectAll = this.get('selectAllDevice');
            var rowList = this.get("deviceList");
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    set(row,"checked",selectAll); 
                }
            });
        }.observes("selectAllDevice"),

	actions:{
        showMultiSearchBlockAction:function(){
            set(this,'isShowMultiSearchBlock',true);
        },
        hideMultiSearchBlockAction:function(){
            set(this,'isShowMultiSearchBlock',false);
        },
		showVmBlockAction: function(){
			var self = this;
            var rowList = self.get("deviceList");

            if(!Ember.isEmpty(rowList)){
                var ids = [];
                Object.keys(rowList).forEach(function (key) {
                    var re = /^[0-9]*]*$/;
                    if(re.test(key)){
                        var row = rowList[key];
                        if(row.checked === true){
                            var currentData = {};
                            currentData.ID = parseInt(row.ID);
                            ids.pushObject(currentData);
                        }
                    }
                });
            }else{
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "请先搜索并选中要操作的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(ids.length === 0){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "请先选中要操作的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }
            self.set('isShowVmBlock', true);
		},
		searchDeviceAction: function(){
			var self = this;
			var form = self.get("searchForm");
			self.set('deviceList',null);
			self.set('searchDeviceMessage',null);
			self.set('isShowVmBlock', false);
			this.get("deviceSrv").list(100,0,form).then(function(data){
                if(data.Content.recordCount <= 0){
                	self.set('searchDeviceMessage', "<span class='text-danger'>未搜索到相关物理机!</span>");
                }else{
                	var rows = [];
                	var selectAll = self.get("selectAllDevice");
                	for(var i=0;i<data.Content.list.length;i++){
                		var row = data.Content.list[i];
                		row.checked = selectAll;
                		rows.pushObject(row);
                	}
                	self.set('deviceList', rows);
                }
            });
		},
		saveBatchVmInstallAction: function(){
            var self = this;
            var rowList = self.get("deviceList");
            var ids = [];
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = parseInt(row.ID);
                        ids.pushObject(currentData);
                    }
                }
            });

            if(ids.length === 0){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "请先选中要操作的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            var batchVmInfo = self.get("model.batchVmInfo");
            self.set("model.batchVmInfo.Message",null);
            if(Ember.isEmpty(batchVmInfo.VmNumber) 
                || Ember.isEmpty(batchVmInfo.OsID) 
                || Ember.isEmpty(batchVmInfo.CpuCoresNumber)
                || Ember.isEmpty(batchVmInfo.MemoryCurrent)
                || Ember.isEmpty(batchVmInfo.DiskSize)
            ){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "请将各信息填写完整!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }
            var info = {};
            info.Devices = ids;
            info.VmNumber = parseInt(batchVmInfo.VmNumber);
            info.OsID = parseInt(batchVmInfo.OsID);
            info.CpuCoresNumber = parseInt(batchVmInfo.CpuCoresNumber);
            info.MemoryCurrent = parseInt(batchVmInfo.MemoryCurrent);
            info.DiskSize = parseInt(batchVmInfo.DiskSize);

            self.get("vmInstallSrv").create(info).then(function(data) {
                if(data.Status==="success"){
                    //self.set("model.batchVmInfo.Message","<span class='text-success'>操作成功!</span>");
                    Ember.$.notify({
                        	message: "操作成功!"
                        }, {
                        	animate: {
                        		enter: 'animated fadeInRight',
                        		exit: 'animated fadeOutRight'
                        	},
                        	type: 'success'
                        });
                    self.transitionToRoute('dashboard.vm.list','all');
                } else {
                    //self.set("model.batchVmInfo.Message","<span class='text-danger'>"+data.Message+"</span>");
                    	Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: data.Message,
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
