import Ember from 'ember';
import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin, {
  breadCrumb: {
    title: "发现新设备",
    isShow: true,
  },
  userSrv: Ember.inject.service('api/user/service'),
  form: {
    Status: "Enable"
  },
  model: function() {
    console.log("model function")
    return Ember.RSVP.hash({
      isShowModalIpmi: false,
      isShowIpmiConsoleModal: false,
      selectUserID: null,
      ipmi: {
        Sn: null,
        User: "",
        Password: "",
        ConsoleUrl: null,
        OobIp: null,
        Hostname: null,
        DeviceIp: null,
        ActionName: "",
        Message: ""
      },
      calculateRule: [{
        id: ">",
        name: "大于"
      }, {
        id: "=",
        name: "等于"
      }, {
        id: "<",
        name: "小于"
      }, {
        id: "!=",
        name: "不等于"
      }],
      isShowAssignUserModal: false,
      userData: this.get('userSrv').list(10000, 0, {
        Status: "Enable"
      }).then(function(data) {
        if (!Ember.isEmpty(data.Content) && !Ember.isEmpty(data.Content.list)) {
          return data.Content.list;
        }
      }),
      selectCount: 0,
    });
  },
  setupController: function(controller, model) {
    console.log("setupController")
    controller.set("model", model);
    var form = {
      Status: status,
      OsID: null,
      HardwareID: null,
      SystemID: null,
      Keyword: null,
      IsShowActiveDevice: "Yes"
    };
    controller.send("queryAction", form);
    controller.send("queryCompanyAction");
    var session = this.get("userSrv").getLocalSession();
    if (Ember.isEmpty(session)) {
      this.get('controller').transitionToRoute('login');
    } else {
      if (Ember.isEmpty(session.Username) || Ember.isEmpty(session.Role)) {
        this.get('controller').transitionToRoute('login');
      }
    }
    model.session = session;
  }
});