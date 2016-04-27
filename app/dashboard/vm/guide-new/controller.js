import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	deviceSrv: Ember.inject.service('api/device/service'),
    networkSrv: Ember.inject.service('api/network/service'),
	isShowMultiSearchBlock:false, //是否显示复杂查询区块
	isShowInstallInfoCol:false,
    //虚拟机装机
    vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
    currentStep: 0,
    nextStep:1,
    lastStep:-1,
    isShowMemoryMore:false,
    isShowDiskMore:false,
    isShowingModal: true,

    searchForm:{Status:"success",Keyword:null},
	selectAllDevice:true,
	currentDeviceIndex:0,

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
        showMultiSearchBlockAction:function(){
            set(this,'isShowMultiSearchBlock',true);
        },
        hideMultiSearchBlockAction:function(){
            set(this,'isShowMultiSearchBlock',false);
        },
		searchDeviceAction: function(){
			var self = this;
			var form = self.get("searchForm");
			self.set('deviceList',null);
			self.set('searchDeviceMessage',null);
			self.set('isShowVmBlock', false);
			self.set('currentDeviceIndex',0);
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
                    self.get("networkSrv").getNotUsedIPListByNetworkId(data.Content.list[0].NetworkID).then(function(response){
                        var list = response.Content;
                        var newIP = null;
                        if(!Ember.isEmpty(list) && list.length > 0){
                            var host = self.get("model.vmInfo.Host");
                            for(var i=0;i<list.length;i++){
                                var isUsed = false;
                                if(!Ember.isEmpty(host) && host.length > 0){
                                    for(var j=0;j<host.length;j++){
                                        if(host[j].Ip === list[i].Ip){
                                            isUsed = true;
                                        }
                                    }
                                }
                                if(isUsed === false){
                                    newIP = list[i].Ip;
                                    break;
                                }
                            }
                        }
                        var host = [{Hostname:"",Ip:newIP,Mac:self.get("model.newMacAddress"),OsID:null,DeviceId:data.Content.list[0].ID}];
                        self.set("model.vmInfo.Host",host);
                    });
                	
                }
            });
		},
        installVmAction:function(deviceId){
            set(this,"model.vmInfo.DeviceId",deviceId);
            set(this,"isShowingModal",true);
            //console.log(this.get("model.vmInfo"));
        },
        goToStep: function(step){
            var self = this;
            var vmInfo = self.get("model.vmInfo");
            if(step === 1){
                var rowList = self.get("deviceList");
                var ids = [];
                if(Ember.isEmpty(rowList)){
                    alert("请先搜索并选中要操作的物理机!");
                    return ;
                }
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
                    alert("请选择要操作的物理机！");
                    return ;
                }
            }else if(step === 2){
                var hosts = vmInfo.Host;
                for(var i=0;i<hosts.length;i++){
                    var host = hosts[i];
                    if(Ember.isEmpty(host.Hostname) || Ember.isEmpty(host.Ip) || Ember.isEmpty(host.Mac) || Ember.isEmpty(host.OsID)){
                        alert("请将信息填写完整!");
                        return ;
                    }
                }
            }else if(step === 3){
                if(Ember.isEmpty(vmInfo.Cpu.CoresNumber) || vmInfo.Cpu.CoresNumber <= 0){
                    alert("请填写正确的CPU核数!");
                    return ;
                }
            }else if(step === 4){
                if(Ember.isEmpty(vmInfo.Memory.Current) || vmInfo.Memory.Current <= 0 || Ember.isEmpty(vmInfo.Memory.Max) || vmInfo.Memory.Max <= 0){
                    alert("请填写正确的内存参数信息!");
                    return ;
                }
            }else if(step === 5){
                if(Ember.isEmpty(vmInfo.Disk.Size) || vmInfo.Disk.Size <= 0){
                    alert("请填写正确的内存参数信息!");
                    return ;
                }
            }
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
          var currentDeviceIndex = self.get("currentDeviceIndex");
          currentDeviceIndex++;
          var deviceList = self.get("deviceList");
          if(currentDeviceIndex >=  deviceList.length){
          	currentDeviceIndex = 0;
          }
          
          self.set('currentDeviceIndex',currentDeviceIndex);
          self.get("vmInstallSrv").createNewMacAddress().then(function(response) {
                if(response.Status==="success"){
                    self.get("networkSrv").getNotUsedIPListByNetworkId(deviceList[currentDeviceIndex].NetworkID).then(function(response2){
                        var newIP = null;
                        var list = response2.Content;
                        if(!Ember.isEmpty(list) && list.length > 0){
                            var host = data;
                            for(var i=0;i<list.length;i++){
                                var isUsed = false;
                                if(!Ember.isEmpty(host) && host.length > 0){
                                    for(var j=0;j<host.length;j++){
                                        if(host[j].Ip === list[i].Ip){
                                            isUsed = true;
                                        }
                                    }
                                }

                                if(isUsed === false){
                                    newIP = list[i].Ip;
                                    break;
                                }
                            }
                        }

                        for(var i=0;i<data.length;i++){
                            newData.pushObject(data[i]);
                            if(i === key){
                                var row = {};
                                //row.Hostname = data[i].Hostname;
                                row.Ip = newIP;
                                row.DeviceId = deviceList[currentDeviceIndex].ID;
                                row.Os = data[i].Os;
                                row.Mac = response.Content;
                                newData.pushObject(row);
                            }
                        }
                        set(self,"model.vmInfo.Host",newData);
                    });
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

          var self = this;
          var currentDeviceIndex = self.get("currentDeviceIndex");
          currentDeviceIndex--;
          if(currentDeviceIndex <= 0){
          	currentDeviceIndex = 0;
          }
          self.set('currentDeviceIndex',currentDeviceIndex);

        },
        saveVmInstallAction:function(){
          var self = this;

            var rowList = self.get("deviceList");
            var ids = [];
            if(Ember.isEmpty(rowList)){
                alert("请先搜索并选中要操作的物理机!");
                return ;
            }
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
                alert("请选择要操作的物理机！");
                return ;
            }

          var vmInfo = this.get("model.vmInfo");
          var hosts = vmInfo.Host;
         
          var rows = [];
          for(var i=0;i<hosts.length;i++){
            var row = {};
            var host = hosts[i];
            row.DeviceID = parseInt(host.DeviceId);
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
                    
                    */
                    alert("操作成功！");
                    self.transitionToRoute('dashboard.vm.list',"all");
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
	}
});
