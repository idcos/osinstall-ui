import Ember from 'ember'
import breadCrumbMixin from '../../mixins/bread-crumb-mixin'
export default Ember.Route.extend(breadCrumbMixin, {
  breadCrumb: {
    title: '作业管理',
    isShow: true
  },
  deviceSrv: Ember.inject.service('api/task-info/service'),
  userSrv: Ember.inject.service('api/user/service'),
  model: function () {
    return Ember.RSVP.hash({
      userData: this.get('userSrv').list(10000, 0, {
        Status: 'Enable'
      }).then(function (data) {
        if (!Ember.isEmpty(data.Content) && !Ember.isEmpty(data.Content.list)) {
          return data.Content.list
        }
      }),
      page: {
        'pageSize': 10,
        'page': 1,
        'count': Math.ceil(1 / 10)
      }
    })
  },
  setupController: function (controller, model) {
    let item = {
      limit: model.page.pageSize,
      offset: (model.page.page - 1) * model.page.pageSize,
      param: {}
    }
    controller.set('model', model)
    controller.send('queryAction', item)
  }
})
