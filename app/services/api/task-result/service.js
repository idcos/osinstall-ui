/*
* 操作系统相关
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember'
var ajax = Ember.$.ajax

export default Ember.Service.extend({

  /*
  * 获取列表
  */
  list: function (limit, offset, taskID) {
    var url = '/api/osinstall/v1/task/result/list'
    // 生成发请求数据对象
    var data = {}
    data.Limit = limit
    data.Offset = offset  
    data.TaskID = taskID
    // 发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'url': url,
      'data': JSON.stringify(data)
    })
  }

})
