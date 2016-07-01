/*
* 操作系统相关
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({

    /*
    * 新增操作系统
    */
    save : function(form) {
        var url = "/api/osinstall/v1/dhcp/subnet/save";
		//生成发请求数据对象
		var data = {};
		data = form;
		if(!Ember.isEmpty(data.ID)){
			data.ID = parseInt(data.ID);
		}
		
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
    list : function(limit,offset) {
        var url = "/api/osinstall/v1/dhcp/subnet/list";
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