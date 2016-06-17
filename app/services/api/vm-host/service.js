/*
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({
    /*
    * 获取操作系统具体信息
    */
    get : function(sn) {
        var url = "/api/osinstall/v1/vm/host/viewBySn";
		//生成发请求数据对象
		var data = {};
		data.Sn = sn;

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
    list : function(limit,offset,form) {
        var url = "/api/osinstall/v1/vm/host/list";
		//生成发请求数据对象
		var data = form;
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

    updateVmHostResource : function() {
        var url = "/api/osinstall/v1/vm/host/collectAndUpdate";
        //发送ajax请求
        return ajax({
            'method': 'GET',
            'contentType': "application/json; charset=utf-8",
            'url': url,
        });
    },
});