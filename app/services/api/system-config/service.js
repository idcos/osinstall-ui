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
    create : function(form) {
        var url = "/api/osinstall/v1/systemConfig/add";
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
    get : function(id) {
        var url = "/api/osinstall/v1/systemConfig/view";
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
    deleteRowById : function(id) {
        var url = "/api/osinstall/v1/systemConfig/delete";
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
    update : function(form) {
        var url = "/api/osinstall/v1/systemConfig/update";
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
    list : function(limit,offset) {
        var url = "/api/osinstall/v1/systemConfig/list";
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