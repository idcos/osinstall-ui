/*
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({

    list : function(deviceId,type,order,maxId) {
        var url = "/api/osinstall/v1/vm/device/log/list";
		//生成发请求数据对象
		var data = {};
		data.DeviceID = parseInt(deviceId);
		data.Type = type;
		data.Order = order;
		data.MaxID = parseInt(maxId);

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

});