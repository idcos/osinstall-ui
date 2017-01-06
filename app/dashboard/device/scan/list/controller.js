import Ember from 'ember';
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
    Keyword: null
  },
  selectAll: false, //是否全选
  isShowMultiSearchBlock: false, //是否显示复杂查询区块
  selectedRows: Ember.computed("rowList.@each.checked", "rowList.length", function() {
    const rowList = this.get("rowList") || [];
    this.updateSelectCount();
    return rowList.filter(it => {
      return it.checked
    })
  }),
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
    self.updateSelectCount();
  }.observes("selectAll"),
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
  CompanyChange: function() {
    var self = this;
    var company = this.get('form.Company');
    self.set('model.modelNameData', null);
    self.set('form.Product', null);
    self.set('form.ModelName', null);
    var form = {};
    form.Company = company;
    var session = this.get("userSrv").getLocalSession();
    if (!Ember.isEmpty(session)) {
      if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
        form.UserID = parseInt(session.ID);
      }
    }
    this.get("deviceSrv").scanModelNameList(form).then(function(data) {
      self.set('model.modelNameData', data.Content);
    });
  }.observes("form.Company"),
  ProductChange: function() {
    var self = this;
    var company = this.get('form.Company');
    var product = this.get('form.Product');
    self.set('model.modelNameData', null);
    self.set('form.ModelName', null);
    var form = {};
    form.Company = company;
    form.Product = product;
    this.get("deviceSrv").scanModelNameList(form).then(function(data) {
      self.set('model.modelNameData', data.Content);
    });
  }.observes("form.Product"),
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
                oobIp = row.Oob || row.OobIp;
              }
            } else {
              oobIp = row.Oob || row.OobIp;
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
    queryAction: function(form) {
      this.set('form', form);
      this.send("pageChanged", this.get("page"));
    },
    searchAction: function() {
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
      var session = this.get("userSrv").getLocalSession();
      if (!Ember.isEmpty(session)) {
        if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
          form.UserID = parseInt(session.ID);
        }
      }
      this.get("deviceSrv").scanList(pageSize, (page - 1) * pageSize, form).then(function(data) {
        var rows = [];
        if (!Ember.isEmpty(data.Content.list) && data.Content.list.length > 0) {
          for (var i = 0; i < data.Content.list.length; i++) {
            var row = data.Content.list[i];
            if (!Ember.isEmpty(row.Cpu)) {
              row.CpuFormat = $.parseJSON(row.Cpu);
            }
            if (!Ember.isEmpty(row.Memory)) {
              row.MemoryFormat = $.parseJSON(row.Memory);
            }
            if (!Ember.isEmpty(row.Disk)) {
              row.DiskFormat = $.parseJSON(row.Disk);
            }
            if (!Ember.isEmpty(row.Nic)) {
              row.NicFormat = $.parseJSON(row.Nic);
              var ips = [];
              for (var j = 0; j < row.NicFormat.length; j++) {
                if (!Ember.isEmpty(row.NicFormat[j].Ip)) {
                  ips.pushObject(row.NicFormat[j]);
                }
              }
              row.NicIp = ips;
            }
            rows.pushObject(row);
          }
        }
        self.set('rowList', rows);
        var pageCount = Math.ceil(data.Content.recordCount / pageSize);
        if (pageCount <= 0) {
          pageCount = 1;
        }
        self.set('pageCount',pageCount);
        self.set('recordCount',data.Content.recordCount);
        self.set('model.NoDataKeywordMessage',null);
        if(!Ember.isEmpty(data.Content.NoDataKeyword)){
          self.set('model.NoDataKeywordMessage',data.Content.NoDataKeyword.join(","));
        }
      });
    },
    queryCompanyAction: function() {
      var self = this;
      this.get("deviceSrv").scanCompanyList().then(function(data) {
        if (data.Status === "success") {
          self.set('model.companyData', data.Content);
        }
      });
    },
    assignSelectDevicesUserAction: function(value) {
      var self = this;
      var rowList = self.get("rowList");
      var form = [];
      for (var i = 0; i < rowList.length; i++) {
        var row = rowList[i];
        if (row.checked === true) {
          var currentData = {};
          currentData.ID = row.ID;
          currentData.UserID = self.get("model.selectUserID");
          form.pushObject(currentData);
        }
      }
      if (form.length === 0) {
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
        return;
      }
      self.get("deviceSrv").batchAssignScanDeviceUser(form).then(function(data) {
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
          self.toggleProperty('model.isShowAssignUserModal');
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
    showAssignUserModalAction: function(value) {
      var self = this;
      var rowList = self.get("rowList");
      var form = [];
      for (var i = 0; i < rowList.length; i++) {
        var row = rowList[i];
        if (row.checked === true) {
          var currentData = {};
          currentData.ID = row.ID;
          currentData.UserID = self.get("model.selectUserID");
          form.pushObject(currentData);
        }
      }
      if (form.length === 0) {
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
        return;
      }
      this.toggleProperty('model.isShowAssignUserModal');
    },
    toggleModal: function() {
      this.toggleProperty('model.isShowAssignUserModal');
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
        self.get("deviceSrv").batchDeleteScanDevice(datas).then(function(data) {
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
    exportAction: function(value) {
      var self = this;
      if (value === "select") {
        var rowList = self.get("rowList");
        var ids = [];
        for (var i = 0; i < rowList.length; i++) {
          var row = rowList[i];
          if (row.checked === true) {
            ids.push(row.ID);
          }
        }
        if (ids.length === 0) {
          Ember.$.notify({
            title: "<strong>操作失败:</strong>",
            message: "请先选中要导出的项!",
          }, {
            animate: {
              enter: 'animated fadeInRight',
              exit: 'animated fadeOutRight'
            },
            type: 'danger'
          });
          return;
        }
      }
      var url = "?method=get";
      if (value === "select") {
        ids = ids.join(",");
        url += "&ids=" + ids;
      }
      var form = self.get("form");
      if (!Ember.isEmpty(form.Keyword)) {
        url += "&Keyword=" + encodeURI(form.Keyword);
      }
      var session = this.get("userSrv").getLocalSession();
      if (!Ember.isEmpty(session)) {
        if (!Ember.isEmpty(session.Role) && session.Role != "Administrator") {
          form.UserID = parseInt(session.ID);
          url += "&UserID=" + form.UserID;
        }
      }
      if (!Ember.isEmpty(form.Company)) {
        url += "&Company=" + form.Company;
      }
      if (!Ember.isEmpty(form.Product)) {
        url += "&Product=" + form.Product;
      }
      if (!Ember.isEmpty(form.ModelName)) {
        url += "&ModelName=" + form.ModelName;
      }
      if (!Ember.isEmpty(form.CpuRule)) {
        url += "&CpuRule=" + form.CpuRule;
      }
      if (!Ember.isEmpty(form.Cpu)) {
        url += "&Cpu=" + form.Cpu;
      }
      if (!Ember.isEmpty(form.MemoryRule)) {
        url += "&MemoryRule=" + form.MemoryRule;
      }
      if (!Ember.isEmpty(form.Memory)) {
        url += "&Memory=" + form.Memory;
      }
      if (!Ember.isEmpty(form.DiskRule)) {
        url += "&DiskRule=" + form.DiskRule;
      }
      if (!Ember.isEmpty(form.Disk)) {
        url += "&Disk=" + form.Disk;
      }
      this.get("deviceSrv").exportScanDevice(url);
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
    newDevices: function() {
      const rows = this.get('selectedRows');
      if (rows.length <= 0) {
        alert("请选择设备！");
        return
      }
      this.transitionToRoute("dashboard.device.new").then((newRoute) => {
        newRoute.controller.set("rows", rows);
      })
    }
  }
});