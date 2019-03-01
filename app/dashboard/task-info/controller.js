import Ember from 'ember'
const {get, set} = Ember

export default Ember.Controller.extend({
  userSrv: Ember.inject.service('api/user/service'),
  taskInfoSrv: Ember.inject.service('api/task-info/service'),

  actions: {
    pageChanged: function (page) {
      let model = this.get('model')
      Ember.set(model, 'page.page', page)
      this.send('queryAction', {
        limit: model.page.pageSize,
        offset: (model.page.page - 1) * model.page.pageSize,
        param: {
          'keyword': model.keyword
        }
      })
    },
    pageSizeChanged: function (pageSize) {
      let model = this.get('model')
      Ember.set(model, 'page.pageSize', pageSize)
      Ember.set(model, 'page.page', 1)
      this.send('queryAction', {
        limit: model.page.pageSize,
        offset: (model.page.page - 1) * model.page.pageSize,
        param: {
          'keyword': model.keyword
        }
      })
    },
    searchAction: function () {
      let model = this.get('model')
      this.send('queryAction', {
        limit: model.page.pageSize,
        offset: (model.page.page - 1) * model.page.pageSize,
        param: {
          'keyword': model.keyword
        }
      })
    },
    queryAction: function (item) {
      let model = this.get('model')
      this.get('taskInfoSrv').list(item.limit, item.offset, item.param).then(res => {
        Ember.set(model, 'infos', res.Content)
        Ember.set(model, 'page.count', Math.ceil(res.Content.recordCount / model.page.pageSize))
      })
    },

    viewResults: function (taskID) {
      let param = {
        'taskID': taskID
      }
      this.transitionToRoute('dashboard.task-result', param)
    },

    delTaskInfo: function (id) {
      let self = this

      if (confirm('确定删除吗?')) {
        this.get('taskInfoSrv').delete(id).then(function (data) {
          if (data.Status === 'success') {
            Ember.$.notify({
              message: '操作成功!'
            }, {
              animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
              },
              type: 'success'
            })
            self.send('queryAction', {
              limit: 0,
              offset: 10,
              param: {

              }
            })
          } else {
            Ember.$.notify({
              title: '<strong>操作失败:</strong>',
              message: data.Message
            }, {
              animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
              },
              type: 'danger'
            })
          }
        })
      }
    },

    reExecTask: function (item) {
      console.log(item)
      //   let self = this,
      //     model = this.get('model'),
      //     taskInfoSrv = this.get('taskInfoSrv')

      //   let sns = []
      //   model.selectedDevices.forEach(item => {
      //     sns.push(item.Sn)
      //   })

      //   // TODO 此处需要添加脚本
      //   let extend = {
      //     'SrcFile': item.SrcFile,
      //     'DestFile': item.DestFile,
      //     'ScriptType': 'shell',
      //     'Script': item.Script,
      //     'ScriptParam': item.ScriptParam
      //   }

      //   let submitObj = {
      //     'TaskName': item.TaskName,
      //     'TaskChannel': item.TaskChannel,
      //     'TaskType': taskType,
      //     'Runas': item.Runas,
      //     'Timeout': parseInt(item.Timeout, 10),
      //     'SNs': sns,
      //     'Password': item.Password,
      //     'AccessToken': '',
      //     'Extend': extend
      //   }

    //   taskInfoSrv.create(submitObj).then(item => {
    //     if (item.Status == 'success') {
    //       self.send(toggleModal)
    //       Ember.$.notify({
    //         message: '添加执行作业成功'
    //       }, {
    //         animate: {
    //           enter: 'animated fadeInRight',
    //           exit: 'animated fadeOutRight'
    //         },
    //         type: 'success'
    //       })
    //     } else {
    //       Ember.$.notify({
    //         message: '添加执行作业失败,' + item.Message
    //       }, {
    //         animate: {
    //           enter: 'animated fadeInRight',
    //           exit: 'animated fadeOutRight'
    //         },
    //         type: 'error'
    //       })
    //     }
    //   })
    }
  }

})
