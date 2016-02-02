import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
    networkSrv: Ember.inject.service('api/network/service'),
	page:1,
	pageCount:1,
	pageSize:10,
	form:{DeviceID:null,OsID:null,Keyword:null},
	isShowMultiSearchBlock:false, //是否显示复杂查询区块
	isShowInstallInfoCol:false,
    selectAll:false,//是否全选
    autoRefresh:false,//是否自动刷新
    autoRefreshTimer:null,
    autoRefreshTime:20000,
    //虚拟机装机
    vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
    currentStep: 1,
    nextStep:2,
    lastStep:0,
    isShowMemoryMore:false,
    isShowDiskMore:false,
    isShowingModal: false,

    ipChanged: function() {
        var self = this;
        var rows = this.get('model.vmInfo.Host');
            /*
            if(rows !== null && !Ember.isEmpty(rows) && rows.length > 1){
                for(var i=0;i<rows.length;i++){
                  var row = rows[i];
                  for(var j=0;j<rows.length;j++){
                    if(i !== j && row.Ip === rows[j].Ip){
                      alert("IP:"+row.Ip + "有重复！");
                    }
                  }
                }
            }
            */

        function eachFunction(row){
            var regexp =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if(regexp.test(row.Ip)){
                //set(row,"messageIp",null);
                var isError = false;
                for(var j=0;j<rows.length;j++){
                  if(i !== j && row.Ip === rows[j].Ip){
                    //set(row,"messageIp","<span class='text-danger'>IP有重复!</span>");
                    isError = true;
                  }
                }

                if(isError === false){
                        self.get('networkSrv').validateIp(row.Ip).then(function(data){
                        if(data.Status === "failure"){
                            //set(row,"messageIp","<span class='text-danger'>"+data.Message+"</span>");
                            alert(row.Ip + " " + data.Message);
                        }else if(data.Status === "success"){
                            //set(row,"isShowNetworkInfo",true);
                            set(row,"Network",data.Content.Network);  
                            set(row,"NetworkID",data.Content.ID);
                            //set(row,"messageIp","<span class='text-success'>IP填写正确!</span>");
                            
                        }
                    });
                }
            }else{
                //set(row,"messageIp","<span class='text-danger'>IP格式不正确!</span>");
            }
        }

        for (var i=0;i<rows.length;i++) {
            var row = rows[i];
          
            //set(row,"isShowNetworkInfo",false);
            set(row,"Network",null);
            set(row,"NetworkID",null);

          if(!Ember.isEmpty(row.Ip)){
                eachFunction(row);
          }else{
                //set(row,"isShowNetworkInfo",false);
          }
        }
  }.observes("model.vmInfo.Host.@each.Ip"),

  autoRefreshChange: function() {
            var self = this;
            var autoRefresh = this.get('autoRefresh');
            if(autoRefresh === true){
                this.set('autoRefreshTimer', setInterval(function() {
                    self.send("pageChanged",self.get("page"));
                }, self.get("autoRefreshTime")));
            }else{
                clearInterval(self.get('autoRefreshTimer'));
                self.set('autoRefreshTimer', null);
            }
        }.observes("autoRefresh"),

        selectAllChange: function() {
            var self = this;
            var selectAll = this.get('selectAll');
            var rowList = this.get("rowList");
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    set(row,"checked",selectAll); 
                }
            });
        }.observes("selectAll"),

	actions:{
        installVmAction:function(deviceId){
            set(this,"model.vmInfo.DeviceId",deviceId);
            set(this,"isShowingModal",true);
            //console.log(this.get("model.vmInfo"));
        },
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
        saveVmInstallAction:function(){
          var self = this;
          var vmInfo = this.get("model.vmInfo");
          var hosts = vmInfo.Host;
          var rows = [];
          for(var i=0;i<hosts.length;i++){
            var row = {};
            var host = hosts[i];
            row.DeviceID = parseInt(vmInfo.DeviceId);
            row.Hostname = host.Hostname;
            row.Mac = host.Mac;
            row.Ip = host.Ip;
            if(!Ember.isEmpty(host.NetworkID)){
                row.NetworkID = parseInt(host.NetworkID);
            }
            if(!Ember.isEmpty(host.OsID)){
                row.OsID = parseInt(host.OsID);
            }
            if(!Ember.isEmpty(vmInfo.Cpu.CoresNumber)){
                row.CpuCoresNumber = parseInt(vmInfo.Cpu.CoresNumber);
            }
            
            row.CpuHotPlug = 'No';
            row.CpuPassthrough = 'No';
            if(vmInfo.Cpu.isShowCpuMore === true){
                row.CpuHotPlug = vmInfo.Cpu.HotPlug === true ? 'Yes' : 'No';
                row.CpuPassthrough = vmInfo.Cpu.Passthrough === true ? 'Yes' : 'No';
            }

            if(vmInfo.Cpu.isShowCpuTopBlock === true){
                row.CpuTopSockets = parseInt(vmInfo.Cpu.TopSockets);
                row.CpuTopCores = parseInt(vmInfo.Cpu.TopCores);
                row.CpuTopThreads = parseInt(vmInfo.Cpu.TopThreads);
            }

            if(vmInfo.Cpu.isShowCpuPinningBlock === true){
                row.CpuPinning = vmInfo.Cpu.Pinning;
            }

            if(!Ember.isEmpty(vmInfo.Memory.Current)){
                row.MemoryCurrent = parseInt(vmInfo.Memory.Current);
            }
            if(!Ember.isEmpty(vmInfo.Memory.Max)){
                row.MemoryMax = parseInt(vmInfo.Memory.Max);
            }
            row.MemoryKsm = "No";
            if(vmInfo.Memory.isShowMemoryMore === true){
                row.MemoryKsm = vmInfo.Memory.Ksm === true ? 'Yes' : 'No';
            }

            row.DiskType = vmInfo.Disk.Type;
            if(!Ember.isEmpty(vmInfo.Disk.Size)){
                row.DiskSize = parseInt(vmInfo.Disk.Size);
            }
            if(vmInfo.Disk.isShowDiskMore === true){
                row.DiskBusType = vmInfo.Disk.BusType;
                row.DiskCacheMode = vmInfo.Disk.CacheMode;
                row.DiskIoMode = vmInfo.Disk.IOMode;
            }
            row.NetworkType = vmInfo.Network.Type;
            row.NetworkDeviceType = vmInfo.Network.DeviceType;
            row.DisplayType = vmInfo.Display.Type;
            if(row.DisplayType !== "serialPorts"){
                row.DisplayPassword = vmInfo.Display.Password;
                row.DisplayUpdatePassword = vmInfo.Display.UpdatePassword === true ? 'Yes' : 'No';
            }
            rows.pushObject(row);
          }
          self.get("vmInstallSrv").batchAdd(rows).then(function(data) {
                if(data.Status==="success"){
                    /*
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
                    */
                    alert("操作成功！");
                    self.send("pageChanged",self.get("page"));
                    self.send("toggleModal");
                } else {
                    /*
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
                    */
                    alert("操作失败："+data.Message);
                }
            });
        },


		showMultiSearchBlockAction:function(){
			set(this,'isShowMultiSearchBlock',true);
		},
		hideMultiSearchBlockAction:function(){
			set(this,'isShowMultiSearchBlock',false);
		},
        searchBatchNumberAction:function(batchNumber){
            //set(this,'form.BatchNumber',batchNumber);
            var keyword = this.get("form.Keyword");
            if(!Ember.isEmpty(keyword)){
                keyword += "\n" + batchNumber;
            }else{
                keyword = batchNumber;
            }
            set(this,'form.Keyword',keyword);
            this.send("pageChanged",this.get("page"));
        },
		queryAction:function(form){
			this.set('form',form);
			this.send("pageChanged",this.get("page"));
            var self = this;
            if(this.get("autoRefresh") === true && this.get("autoRefreshTimer") === null){
                this.set('autoRefreshTimer', setInterval(function() {
                    self.send("pageChanged",self.get("page"));
                }, self.get("autoRefreshTime")));
            }
		},
		searchAction:function(){
            //console.log(this.get("form"));
			this.send("pageChanged",this.get("page"));
		},
		pageChanged:function(page){
			var self = this;
			this.set("page",page);
			var pageSize = this.get("pageSize");
			var form = this.get("form");
			if(form.Status === "installing" || form.Status === "failure"){
				self.set('isShowInstallInfoCol',true);
			}else{
				self.set('isShowInstallInfoCol',false);
			}
			this.get("vmInstallSrv").list(pageSize,(page-1)*pageSize,form).then(function(data){
                self.set('rowList', data.Content.list);
                var pageCount = Math.ceil(data.Content.recordCount/pageSize);
                if(pageCount <= 0){
                	pageCount = 1;
                }
                self.set('pageCount',pageCount);
            });
		},
        reInstallAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        datas.pushObject(currentData);
                    }
                }
            });
            if(datas.length === 0){
                alert("请先选中要重装的设备!");
                return ;
            }
            self.get("vmInstallSrv").batchReInstall(datas).then(function(data) {
                    if(data.Status==="success"){
                        Ember.$.notify({
                            message: "操作成功!"
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'success'
                        });
                        self.send("pageChanged",self.get("page"));
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

        batchDeleteAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        datas.pushObject(currentData);
                    }
                }
            });
            if(datas.length === 0){
                alert("请先选中要删除的设备!");
                return ;
            }
            if(confirm("确定删除吗?")){
                self.get("vmInstallSrv").batchDelete(datas).then(function(data) {
                    if(data.Status==="success"){
                        Ember.$.notify({
                            message: "操作成功!"
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'success'
                        });
                        self.send("pageChanged",self.get("page"));
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
            }
        },

		
		deleteAction: function(id) {
            if(confirm("确认删除吗？")){
    			var self = this;
            	self.get("vmInstallSrv").deleteRowById(id).then(function(data) {
                    if(data.Status==="success"){
                        Ember.$.notify({
                        	message: "删除成功!"
                        }, {
                        	animate: {
                        		enter: 'animated fadeInRight',
                        		exit: 'animated fadeOutRight'
                        	},
                        	type: 'success'
                        });
                        //self.transitionToRoute('dashboard.os.list');
                        self.send("pageChanged",self.get("page"));
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
            }
        },
	}
});
