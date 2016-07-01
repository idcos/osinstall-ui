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
        var url = "/api/osinstall/v1/platformConfig/save";
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
    getByName : function(name) {
        var url = "/api/osinstall/v1/platformConfig/viewByName";
		//生成发请求数据对象
		var data = {};
		data.Name = name;

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },
});