/*
 * author:lizhongdang
 * 2015-11-24
 */
import Ember from 'ember';
var ajax = Ember.$.ajax;
export default Ember.Service.extend({
  batchPowerOn: function(form) {
    var url = "/api/osinstall/v1/device/batchPowerOn";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  batchStartFromPxe: function(form) {
    var url = "/api/osinstall/v1/device/batchStartFromPxe";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  batchPowerOff: function(form) {
    var url = "/api/osinstall/v1/device/batchPowerOff";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  batchRestart: function(form) {
    var url = "/api/osinstall/v1/device/batchReStart";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  batchOnline: function(form) {
    var url = "/api/osinstall/v1/device/batchOnline";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  batchOffline: function(form) {
    var url = "/api/osinstall/v1/device/batchOffline";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  encodeIpmiPassportInfo: function(form) {
    var url = "/api/osinstall/v1/ipmi/passport/encode";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  decodeIpmiPassportInfo: function(form) {
    var url = "/api/osinstall/v1/ipmi/passport/decode";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  getImportPriview: function(filename, limit, offset) {
    var url = "/api/osinstall/v1/resourcesPool/device/importPriview";
    //生成发请求数据对象
    var data = {};
    data.Filename = filename;
    data.Limit = parseInt(limit);
    data.Offset = parseInt(offset);
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  importDevice: function(filename) {
    var url = "/api/osinstall/v1/resourcesPool/device/importDevice";
    //生成发请求数据对象
    var data = {};
    data.Filename = filename;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  create: function(form) {
    var url = "/api/osinstall/v1/resourcesPool/add";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  /*
   * 获取操作系统具体信息
   */
  get: function(id) {
    var url = "/api/osinstall/v1/resourcesPool/view";
    //生成发请求数据对象
    var data = {};
    data.ID = parseInt(id);
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  /*
   * 删除操作系统具体信息
   */
  deleteRowById: function(id) {
    var url = "/api/osinstall/v1/resourcesPool/delete";
    //生成发请求数据对象
    var data = {};
    data.ID = parseInt(id);
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  /*
   * 修改操作系统
   */
  update: function(form) {
    var url = "/api/osinstall/v1/resourcesPool/update";
    //生成发请求数据对象
    var data = {};
    data = form;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
  /*
   * 获取列表
   */
  list: function(limit, offset) {
    var url = "/api/osinstall/v1/resourcesPool/list";
    //生成发请求数据对象
    var data = {};
    data.Limit = limit;
    data.Offset = offset;
    //发送ajax请求
    return ajax({
      'method': 'POST',
      'contentType': "application/json; charset=utf-8",
      'url': url,
      'data': JSON.stringify(data),
    });
  },
});