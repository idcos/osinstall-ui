import Ember from 'ember';
import encodeUrl from 'ui/utils/encode-url';
const {
  get,
  set,
  computed
} = Ember;

import t from 'ui/utils/translate';
const OPERATE_FAILED_TITLE = "<strong>" + t("note.operateFailed") + ":</strong>";

export default Ember.Controller.extend({
  deviceSrv: Ember.inject.service('api/device/service'),
  networkSrv: Ember.inject.service('api/network/service'),
  userSrv: Ember.inject.service('api/user/service'),
  resourcesPoolSrv: Ember.inject.service('api/resources-pool/service'),
  page: 1,
  pageCount: 1,
  pageSize: 20,
  form: {
    Status: null,
    OsID: null,
    HardwareID: null,
    SystemID: null,
    Keyword: null,
    BatchNumber: null
  },
  isShowMultiSearchBlock: false, //是否显示复杂查询区块
  isShowInstallInfoCol: false,
  selectAll: false, //是否全选
  autoRefresh: true, //是否自动刷新
  autoRefreshTimer: null,
  autoRefreshTime: 20000,
  selectedRows: Ember.computed("rowList.@each.checked", "rowList.length", function() {
    const rowList = this.get("rowList") || [];
    return rowList.filter(it => {
      return it.checked
    })
  }),
  ipChanged: function() {
    var self = this;
    var rows = this.get('model.vmInfo.Host');
    function eachFunction(row) {
      var regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (regexp.test(row.Ip)) {
        //set(row,"messageIp",null);
        var isError = false;
        for (var j = 0; j < rows.length; j++) {
          if (i !== j && row.Ip === rows[j].Ip) {
            //set(row,"messageIp","<span class='text-danger'>IP有重复!</span>");
            isError = true;
          }
        }
        if (isError === false) {
          self.get('networkSrv').validateIp(row.Ip).then(function(data) {
            if (data.Status === "failure") {
              //set(row,"messageIp","<span class='text-danger'>"+data.Message+"</span>");
              alert(row.Ip + " " + data.Message);
            } else if (data.Status === "success") {
              //set(row,"isShowNetworkInfo",true);
              set(row, "Network", data.Content.Network);
              set(row, "NetworkID", data.Content.ID);
              //set(row,"messageIp","<span class='text-success'>IP填写正确!</span>");
            }
          });
        }
      } else {
        //set(row,"messageIp","<span class='text-danger'>IP格式不正确!</span>");
      }
    }
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      //set(row,"isShowNetworkInfo",false);
      set(row, "Network", null);
      set(row, "NetworkID", null);
      if (!Ember.isEmpty(row.Ip)) {
        eachFunction(row);
      } else {
        //set(row,"isShowNetworkInfo",false);
      }
    }
  }.observes("model.vmInfo.Host.@each.Ip"),

  updateSelectCount:function(){
            var self = this;
            var rowList = self.get("rowList");
            var num = 0;
            if(!Ember.isEmpty(rowList)){
                for(var i=0;i<rowList.length;i++){
                    var row = rowList[i];
                    if(row.checked === true){
                        num++;
                    }
                }
            }
            self.set("model.selectCount",num);
    },
    checkboxCheckedChanged: function() {
        var self = this;
        self.updateSelectCount();
        clearInterval(self.get('autoRefreshTimer'));
    }.observes("rowList.@each.checked"),

  autoRefreshChange: function() {
    var self = this;
    var autoRefresh = this.get('autoRefresh');
    if (autoRefresh === true) {
      this.set('autoRefreshTimer', setInterval(function() {
        self.send("pageChanged", self.get("page"));
      }, self.get("autoRefreshTime")));
    } else {
      clearInterval(self.get('autoRefreshTimer'));
      self.set('autoRefreshTimer', null);
    }
  }.observes("autoRefresh"),
  selectAllChange: function() {
    var self = this;
    var selectAll = this.get('selectAll');
    var rowList = this.get("rowList");
    Object.keys(rowList).forEach(function(key) {
      var re = /^[0-9]*]*$/;
      if (re.test(key)) {
        var row = rowList[key];
        set(row, "checked", selectAll);
      }
    });
  }.observes("selectAll"),
  checkPermissions: function(isCheckUserinfo, isCheckOobinfo) {
    var self = this;
    var rowList = self.get("rowList");
    var datas = [];
    var session = this.get("model.session");
    var isNoPurviewOperation = false;
    var isStop = false;
    var ipmi = this.get("model.ipmi");
    if (isCheckUserinfo === true) {
      if (Ember.isEmpty(ipmi.User) || Ember.isEmpty(ipmi.Password)) {
        self.set("model.ipmi.Message", "<span class='text-danger'>" + t("note.fillUserInfo") + "</span>");
        return;
      }
    }
    var accessToken = session.AccessToken;
    Object.keys(rowList).forEach(function(key) {
      var re = /^[0-9]*]*$/;
      if (re.test(key)) {
        var row = rowList[key];
        if (row.checked === true) {
          var currentData = {};
          currentData.Sn = row.Sn;
          currentData.AccessToken = accessToken;
          if (isCheckOobinfo === true) {
            var oobIp = "";
            if (row.DeviceStatus === "success") {
              if (!Ember.isEmpty(row.ManageIp)) {
                oobIp = row.ManageIp;
              } else {
                oobIp = row.OobIp;
              }
            } else {
              oobIp = row.OobIp;
            }
            currentData.OobIp = oobIp;
            if (Ember.isEmpty(oobIp)) {
              Ember.$.notify({
                title: OPERATE_FAILED_TITLE,
                message: t("note.OOBIpEmpty") + "(SN:" + row.Sn + ")",
              }, {
                animate: {
                  enter: 'animated fadeInRight',
                  exit: 'animated fadeOutRight'
                },
                type: 'danger'
              });
              isStop = true;
            }
            currentData.Username = ipmi.User;
            currentData.Password = ipmi.Password;
          }
          datas.pushObject(currentData);
          if (!Ember.isEmpty(session)) {
            if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
              if (!Ember.isEmpty(session.ID) && row.UserID !== session.ID) {
                isNoPurviewOperation = true;
              }
            }
          }
        }
      }
    });
    if (isStop === true) {
      return;
    }
    if (datas.length === 0) {
      Ember.$.notify({
        title: OPERATE_FAILED_TITLE,
        message: t("app.route.deviceList.assignModal.noSelectedItemMessage"),
      }, {
        animate: {
          enter: 'animated fadeInRight',
          exit: 'animated fadeOutRight'
        },
        type: 'danger'
      });
      return;
    }
    if (isNoPurviewOperation === true) {
      Ember.$.notify({
        title: OPERATE_FAILED_TITLE,
        message: t("note.cantOperateOnOthersDevice"),
      }, {
        animate: {
          enter: 'animated fadeInRight',
          exit: 'animated fadeOutRight'
        },
        type: 'danger'
      });
      return;
    }
    return datas;
  },
  actions: {
    showMultiSearchBlockAction: function() {
      set(this, 'isShowMultiSearchBlock', true);
    },
    hideMultiSearchBlockAction: function() {
      set(this, 'isShowMultiSearchBlock', false);
    },
    searchBatchNumberAction: function(batchNumber) {
      //set(this,'form.BatchNumber',batchNumber);
      var keyword = this.get("form.Keyword");
      if (!Ember.isEmpty(keyword)) {
        keyword += "\n" + batchNumber;
      } else {
        keyword = batchNumber;
      }
      set(this, 'form.Keyword', keyword);
      this.send("pageChanged", this.get("page"));
    },
    queryAction: function(form) {
      this.set('form', form);
      this.send("pageChanged", this.get("page"));
      var self = this;
      if (this.get("autoRefresh") === true && this.get("autoRefreshTimer") === null) {
        this.set('autoRefreshTimer', setInterval(function() {
          self.send("pageChanged", self.get("page"));
        }, self.get("autoRefreshTime")));
      }
    },
    searchAction: function() {
      //console.log(this.get("form"));
      this.send("pageChanged", 1);
    },
    pageSizeChanged: function(pageSize) {
      this.set("pageSize", pageSize);
      this.send("pageChanged", this.get("page"));
    },
    pageChanged: function(page) {
      var self = this;
      this.set("page", page);
      var pageSize = this.get("pageSize");
      var form = this.get("form");
      if (form.Status === "installing" || form.Status === "failure") {
        self.set('isShowInstallInfoCol', true);
      } else {
        self.set('isShowInstallInfoCol', false);
      }
      if (!Ember.isEmpty(this.get("model.status")) && this.get("model.status") !== "all") {
        var session = this.get("model.session");
        if (!Ember.isEmpty(session)) {
          if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
            form.UserID = session.ID;
          }
        }
      }
      const selectedRows = this.get('selectedRows');
      this.get("deviceSrv").list(pageSize, (page - 1) * pageSize, form).then((data) => {
        if(!Ember.isEmpty(data.Content.list)){
          data.Content.list.forEach(it => {
            selectedRows.forEach(row => {
              if (it.ID === row.ID && row.checked) {
                it.checked = true
              }
            })
          });
        }
        self.set('rowList', data.Content.list);
        var pageCount = Math.ceil(data.Content.recordCount / pageSize);
        if (pageCount <= 0) {
          pageCount = 1;
        }
        self.set('pageCount', pageCount);
        self.set('recordCount',data.Content.recordCount);
        self.set('model.NoDataKeywordMessage',null);
        if(!Ember.isEmpty(data.Content.NoDataKeyword)){
          self.set('model.NoDataKeywordMessage',data.Content.NoDataKeyword.join(","));
        }
      });
    },
    exportAction: function() {
      var self = this;
      var form = this.get("form");
      var url = "?method=get";
      if (!Ember.isEmpty(this.get("model.status")) && this.get("model.status") !== "all") {
        var session = this.get("model.session");
        if (!Ember.isEmpty(session)) {
          if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
            form.UserID = session.ID;
            url += "&UserID=" + form.UserID;
          }
        }
      }
      if (!Ember.isEmpty(form.Keyword)) {
        url += "&Keyword=" + encodeUrl(form.Keyword);
      }
      if (!Ember.isEmpty(form.OsID)) {
        url += "&OsID=" + form.OsID;
      }
      if (!Ember.isEmpty(form.HardwareID)) {
        url += "&HardwareID=" + form.HardwareID;
      }
      if (!Ember.isEmpty(form.SystemID)) {
        url += "&SystemID=" + form.SystemID;
      }
      if (!Ember.isEmpty(form.Status)) {
        url += "&Status=" + form.Status;
      }
      if (!Ember.isEmpty(form.BatchNumber)) {
        url += "&BatchNumber=" + form.BatchNumber;
      }
      this.get("deviceSrv").export(url);
    },
    reInstallAction: function() {
      var self = this;
      var rowList = self.get("rowList");
      var datas = [];
      var isHasSuccessDevice = false;
      var session = this.get("model.session");
      var accessToken = session.AccessToken;
      var isNoPurviewOperation = false;
      Object.keys(rowList).forEach(function(key) {
        var re = /^[0-9]*]*$/;
        if (re.test(key)) {
          var row = rowList[key];
          if (row.checked === true) {
            var currentData = {};
            currentData.ID = row.ID;
            currentData.AccessToken = accessToken;
            datas.pushObject(currentData);
            if (row.Status === "success") {
              isHasSuccessDevice = true;
            }
            if (!Ember.isEmpty(session)) {
              if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
                if (!Ember.isEmpty(session.ID) && row.UserID !== session.ID) {
                  isNoPurviewOperation = true;
                }
              }
            }
          }
        }
      });
      if (datas.length === 0) {
        Ember.$.notify({
          title: "<strong>操作失败:</strong>",
          message: "请先选中要重装的设备!",
        }, {
          animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
          },
          type: 'danger'
        });
        return;
      }
      if (isNoPurviewOperation === true) {
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
        return;
      }
      if (isHasSuccessDevice === true) {
        Ember.$.notify({
          title: "<strong>操作失败:</strong>",
          message: "安装成功的设备不允许直接重装!<br>请使用【录入新设备】的功能，重新录入后再安装!",
        }, {
          animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
          },
          type: 'danger'
        });
        return;
      }
      self.get("deviceSrv").batchReInstall(datas).then(function(data) {
        if (data.Status === "success") {
          Ember.$.notify({
            message: "操作成功!"
          }, {
            animate: {
              enter: 'animated fadeInRight',
              exit: 'animated fadeOutRight'
            },
            type: 'success'
          });
          self.send("pageChanged", self.get("page"));
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
        }
      });
    },
    cancelInstallAction: function() {
      var self = this;
      var rowList = self.get("rowList");
      var datas = [];
      var session = this.get("model.session");
      var accessToken = session.AccessToken;
      var isNoPurviewOperation = false;
      Object.keys(rowList).forEach(function(key) {
        var re = /^[0-9]*]*$/;
        if (re.test(key)) {
          var row = rowList[key];
          if (row.checked === true) {
            var currentData = {};
            currentData.ID = row.ID;
            currentData.AccessToken = accessToken;
            datas.pushObject(currentData);
            if (!Ember.isEmpty(session)) {
              if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
                if (!Ember.isEmpty(session.ID) && row.UserID !== session.ID) {
                  isNoPurviewOperation = true;
                }
              }
            }
          }
        }
      });
      if (datas.length === 0) {
        Ember.$.notify({
          title: "<strong>操作失败:</strong>",
          message: "请先选中要取消安装的设备!",
        }, {
          animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
          },
          type: 'danger'
        });
        return;
      }
      if (isNoPurviewOperation === true) {
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
        return;
      }
      self.get("deviceSrv").batchCancelInstall(datas).then(function(data) {
        if (data.Status === "success") {
          Ember.$.notify({
            message: "操作成功!"
          }, {
            animate: {
              enter: 'animated fadeInRight',
              exit: 'animated fadeOutRight'
            },
            type: 'success'
          });
          self.send("pageChanged", self.get("page"));
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
        }
      });
    },
    batchDeleteAction: function() {
      var self = this;
      var rowList = self.get("rowList");
      var datas = [];
      var session = this.get("model.session");
      var isNoPurviewOperation = false;
      var accessToken = session.AccessToken;
      Object.keys(rowList).forEach(function(key) {
        var re = /^[0-9]*]*$/;
        if (re.test(key)) {
          var row = rowList[key];
          if (row.checked === true) {
            var currentData = {};
            currentData.ID = row.ID;
            currentData.AccessToken = accessToken;
            datas.pushObject(currentData);
            if (!Ember.isEmpty(session)) {
              if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
                if (!Ember.isEmpty(session.ID) && row.UserID !== session.ID) {
                  isNoPurviewOperation = true;
                }
              }
            }
          }
        }
      });
      if (datas.length === 0) {
        Ember.$.notify({
          title: "<strong>操作失败:</strong>",
          message: "请先选中要删除的设备!",
        }, {
          animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
          },
          type: 'danger'
        });
        return;
      }
      if (isNoPurviewOperation === true) {
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
        return;
      }
      if (confirm("确定删除吗?")) {
        self.get("deviceSrv").batchDelete(datas).then(function(data) {
          if (data.Status === "success") {
            Ember.$.notify({
              message: "操作成功!"
            }, {
              animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
              },
              type: 'success'
            });
            self.send("pageChanged", self.get("page"));
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
          }
        });
      }
    },
    closeToggleModalIpmi: function() {
      this.toggleProperty('model.isShowModalIpmi');
    },
    toggleModalIpmi: function(key) {
      var self = this;
      var datas = this.checkPermissions(false, true);
      if (!Ember.isEmpty(datas) && datas.length > 0) {
        self.set("model.ipmi.User", null);
        self.set("model.ipmi.Password", null);
        self.set("model.ipmi.ConsoleUrl", null);
        self.set("model.ipmi.Sn", null);
        self.set("model.ipmi.OobIp", null);
        self.set("model.ipmi.Hostname", null);
        self.set("model.ipmi.DeviceIp", null);
        self.set("model.ipmi.ActionName", key);
        self.set("model.ipmi.Message", null);
        this.toggleProperty('model.isShowModalIpmi');
      }
    },
    batchPowerOnAction: function() {
      var self = this;
      var rowList = self.get("rowList");
      var datas = this.checkPermissions(true, true);
      if (!Ember.isEmpty(datas) && datas.length > 0 && confirm(t("confirm.powerOn"))) {
        self.set("model.ipmi.Message", "<span class='text-muted'><img src='image/loading.gif' /> " + t("note.processing") + "</span>");
        self.get("resourcesPoolSrv").batchPowerOn(datas).then(function(data) {
          if (data.Status === "success") {
            self.set("model.ipmi.Message", `<span class='text-success'>${t("app.route.deviceList.operate.powerOnSuccessNote")}</span>`);
            window.setTimeout(function() {
              self.toggleProperty('model.isShowModalIpmi');
            }, 1000);
          } else {
            self.set("model.ipmi.Message", "<span class='text-danger'>" + data.Message + "</span>");
          }
        });
      }
    },
    batchStartFromPxeAction: function() {
      var self = this;
      var datas = this.checkPermissions(true, true);
      if (!Ember.isEmpty(datas) && datas.length > 0 && confirm(t("app.route.deviceList.operate.confirmBootFromPXE"))) {
        self.set("model.ipmi.Message", "<span class='text-muted'><img src='image/loading.gif' /> " + t("note.processing") + "</span>");
        self.get("resourcesPoolSrv").batchStartFromPxe(datas).then(function(data) {
          if (data.Status === "success") {
            self.set("model.ipmi.Message", "<span class='text-success'>" + t("app.route.deviceList.operate.bootFromPXESuccess") + "</span>");
            window.setTimeout(function() {
              self.toggleProperty('model.isShowModalIpmi');
            }, 1000);
          } else {
            self.set("model.ipmi.Message", "<span class='text-danger'>" + data.Message + "</span>");
          }
        });
      }
    },
    batchPowerOffAction: function() {
      var self = this;
      var datas = this.checkPermissions(true, true);
      if (!Ember.isEmpty(datas) && datas.length > 0 && confirm(t("app.route.deviceList.operate.confirmPowerOff"))) {
        self.set("model.ipmi.Message", "<span class='text-muted'><img src='image/loading.gif' /> " + t("note.processing") + "</span>");
        self.get("resourcesPoolSrv").batchPowerOff(datas).then(function(data) {
          if (data.Status === "success") {
            self.set("model.ipmi.Message", "<span class='text-success'>" + t("app.route.deviceList.operate.powerOffSuccess") + "</span>");
            window.setTimeout(function() {
              self.toggleProperty('model.isShowModalIpmi');
            }, 1000);
          } else {
            self.set("model.ipmi.Message", "<span class='text-danger'>" + data.Message + "</span>");
          }
        });
      }
    },
    batchReStartAction: function() {
      var self = this;
      var datas = this.checkPermissions(true, true);
      if (!Ember.isEmpty(datas) && datas.length > 0 && confirm(t("app.route.deviceList.operate.confirmReboot"))) {
        self.set("model.ipmi.Message", "<span class='text-muted'><img src='image/loading.gif' /> " + t("note.processing") + "</span>");
        self.get("resourcesPoolSrv").batchRestart(datas).then(function(data) {
          if (data.Status === "success") {
            self.set("model.ipmi.Message", "<span class='text-success'>" + t("app.route.deviceList.operate.rebootSuccess") + "</span>");
            window.setTimeout(function() {
              self.toggleProperty('model.isShowModalIpmi');
            }, 1000);
          } else {
            self.set("model.ipmi.Message", "<span class='text-danger'>" + data.Message + "</span>");
          }
        });
      }
    },
  }
});