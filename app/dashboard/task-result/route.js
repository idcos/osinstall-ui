import Ember from 'ember'
import breadCrumbMixin from '../../mixins/bread-crumb-mixin'
export default Ember.Route.extend(breadCrumbMixin, {
  breadCrumb: {
    title: '作业管理',
    isShow: true
  },
  userSrv: Ember.inject.service('api/user/service'),
  resultSrv: Ember.inject.service('api/task-result/service'),
  model: function (param) {
    let users = this.get('userSrv').list(10000, 0, {Status: 'Enable'})
    let results = this.get('resultSrv').list(0, 10, param.taskNo)

    return Ember.RSVP.hash({
      userData: users.then(item => {
        return item.Content.list
      }),
      results: results.then(item => {
        return item.Content
      }),
    })
  },
  setupController: function (controller, model) {
    controller.set('model', model)
  }
})
