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
	pageSize:20,
	form:{DeviceID:null,OsID:null,Keyword:null,Status:null,RunStatus:null},
	isShowMultiSearchBlock:false, //是否显示复杂查询区块
    selectAll:false,//是否全选
    //虚拟机装机
    vmInstallSrv: Ember.inject.service('api/vmInstall/service'),
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
		queryAction:function(form){
			this.set('form',form);
			this.send("pageChanged",this.get("page"));
            var self = this;
            self.send("pageChanged",self.get("page"));
		},
		searchAction:function(){
			this.send("pageChanged",1);
		},
        pageSizeChanged:function(pageSize){
            this.set("pageSize",pageSize);
            this.send("pageChanged",this.get("page"));
        },
		pageChanged:function(page){
			var self = this;
			this.set("page",page);
            this.set("selectAll",false);
			var pageSize = this.get("pageSize");
			var form = this.get("form");
			this.get("vmInstallSrv").list(pageSize,(page-1)*pageSize,form).then(function(data){
                self.set('rowList', data.Content.list);
                var pageCount = Math.ceil(data.Content.recordCount/pageSize);
                if(pageCount <= 0){
                	pageCount = 1;
                }
                self.set('pageCount',pageCount);
            });
		},
        lockAction:function(){
            var self = this;
            self.set("model.isButtonLock",true);
            self.set("model.buttonLockNoticeInfo","先点击旁边的解锁按钮后才能使用哦");
        },
        unlockAction:function(){
            var self = this;
            self.set("model.isButtonLock",false);
            self.set("model.buttonLockNoticeInfo",null);
        },
        batchStartAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            var session = this.get("model.session");
            var accessToken = session.AccessToken;
            var isNoPurviewOperation = false;
            var hasRuningVmHostname = "";

            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        currentData.AccessToken = accessToken;
                        datas.pushObject(currentData);

                        if(!Ember.isEmpty(session)){
                            if(!Ember.isEmpty(session.Role) && session.Role != "Administrator"){
                                if(!Ember.isEmpty(session.ID) && row.UserID !== session.ID){
                                    isNoPurviewOperation = true;
                                }
                            }
                        }
                        if(row.RunStatus === "running"){
                            hasRuningVmHostname += row.Hostname+",";
                        }
                    }
                }
            });

            if(datas.length === 0){
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

            
            if(isNoPurviewOperation === true){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "您无权操作其他人的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(hasRuningVmHostname !== ""){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "虚拟机(主机名:"+hasRuningVmHostname.substring(0,hasRuningVmHostname.length - 1)+")已启动!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            self.get("vmInstallSrv").batchStart(datas).then(function(data) {
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
                            title: "<strong>操作失败:</strong>",
                            message: data.Message
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'danger'
                        });
                        self.send("pageChanged",self.get("page"));
                    }
            });
        },
        batchStopAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            var session = this.get("model.session");
            var accessToken = session.AccessToken;
            var isNoPurviewOperation = false;
            var hasStopVmHostname = "";

            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        currentData.AccessToken = accessToken;
                        datas.pushObject(currentData);

                        if(!Ember.isEmpty(session)){
                            if(!Ember.isEmpty(session.Role) && session.Role != "Administrator"){
                                if(!Ember.isEmpty(session.ID) && row.UserID !== session.ID){
                                    isNoPurviewOperation = true;
                                }
                            }
                        }
                        if(row.RunStatus === "stop"){
                            hasStopVmHostname += row.Hostname+",";
                        }
                    }
                }
            });

            if(datas.length === 0){
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

            
            if(isNoPurviewOperation === true){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "您无权操作其他人的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(hasStopVmHostname !== ""){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "虚拟机(主机名:"+hasStopVmHostname.substring(0,hasStopVmHostname.length - 1)+")已停止!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(confirm("确定停止吗?")){
                self.get("vmInstallSrv").batchStop(datas).then(function(data) {
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
                            title: "<strong>操作失败:</strong>",
                            message: data.Message
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'danger'
                        });
                        self.send("pageChanged",self.get("page"));
                    }
                });
            }
        },
        batchReStartAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            var session = this.get("model.session");
            var accessToken = session.AccessToken;
            var isNoPurviewOperation = false;

            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        currentData.AccessToken = accessToken;
                        datas.pushObject(currentData);

                        if(!Ember.isEmpty(session)){
                            if(!Ember.isEmpty(session.Role) && session.Role != "Administrator"){
                                if(!Ember.isEmpty(session.ID) && row.UserID !== session.ID){
                                    isNoPurviewOperation = true;
                                }
                            }
                        }
                    }
                }
            });

            if(datas.length === 0){
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

            
            if(isNoPurviewOperation === true){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "您无权操作其他人的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(confirm("确定重启吗?")){
                self.get("vmInstallSrv").batchReStart(datas).then(function(data) {
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
                            title: "<strong>操作失败:</strong>",
                            message: data.Message
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'danger'
                        });
                        self.send("pageChanged",self.get("page"));
                    }
                });
            }
        },
        batchReInstallAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            var session = this.get("model.session");
            var accessToken = session.AccessToken;
            var isNoPurviewOperation = false;

            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        currentData.AccessToken = accessToken;
                        datas.pushObject(currentData);

                        if(!Ember.isEmpty(session)){
                            if(!Ember.isEmpty(session.Role) && session.Role != "Administrator"){
                                if(!Ember.isEmpty(session.ID) && row.UserID !== session.ID){
                                    isNoPurviewOperation = true;
                                }
                            }
                        }
                    }
                }
            });

            if(datas.length === 0){
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

            
            if(isNoPurviewOperation === true){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "您无权操作其他人的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(confirm("确定重装吗?")){
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
                            title: "<strong>操作失败:</strong>",
                            message: data.Message
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'danger'
                        });
                        self.send("pageChanged",self.get("page"));
                    }
                });
            }
        },

        batchDeleteAction:function(){
            var self = this;
            var rowList = self.get("rowList");
            var datas = [];
            var session = this.get("model.session");
            var accessToken = session.AccessToken;
            var isNoPurviewOperation = false;

            Object.keys(rowList).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    var row = rowList[key];
                    if(row.checked === true){
                        var currentData = {};
                        currentData.ID = row.ID;
                        currentData.AccessToken = accessToken;
                        datas.pushObject(currentData);

                        if(!Ember.isEmpty(session)){
                            if(!Ember.isEmpty(session.Role) && session.Role != "Administrator"){
                                if(!Ember.isEmpty(session.ID) && row.UserID !== session.ID){
                                    isNoPurviewOperation = true;
                                }
                            }
                        }
                    }
                }
            });

            if(datas.length === 0){
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

            
            if(isNoPurviewOperation === true){
                Ember.$.notify({
                                title: "<strong>操作失败:</strong>",
                                message: "您无权操作其他人的设备!",
                            }, {
                                animate: {
                                    enter: 'animated fadeInRight',
                                    exit: 'animated fadeOutRight'
                                },
                                type: 'danger'
                            });
                return ;
            }

            if(confirm("确定销毁吗?")){
                console.log(datas);
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
                            title: "<strong>操作失败:</strong>",
                            message: data.Message
                        }, {
                            animate: {
                                enter: 'animated fadeInRight',
                                exit: 'animated fadeOutRight'
                            },
                            type: 'danger'
                        });
                        self.send("pageChanged",self.get("page"));
                    }
                });
            }
        },
	}
});
