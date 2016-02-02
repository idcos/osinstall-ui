/*
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
        var url = "/api/osinstall/v1/device/add";
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
    * 重装操作系统
    */
    batchReInstall : function(form) {
        var url = "/api/osinstall/v1/device/batchReInstall";
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
    * 取消安装操作系统
    */
    batchCancelInstall : function(form) {
        var url = "/api/osinstall/v1/device/batchCancelInstall";
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
    * 批量删除
    */
    batchDelete : function(form) {
        var url = "/api/osinstall/v1/device/batchDelete";
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
    * 新增
    */
    batchCreate : function(form) {
        var url = "/api/osinstall/v1/device/batchAdd";
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

    //修改
    batchUpdate : function(form) {
        var url = "/api/osinstall/v1/device/batchUpdate";
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
        var url = "/api/osinstall/v1/device/view";
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
    * 获取操作系统具体信息
    */
    getFull : function(id) {
        var url = "/api/osinstall/v1/device/viewFull";
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
        var url = "/api/osinstall/v1/device/delete";
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
        var url = "/api/osinstall/v1/device/update";
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
    list : function(limit,offset,form) {
        var url = "/api/osinstall/v1/device/list";
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

    /*
    * 获取列表
    */
    getNumByStatus : function(status) {
        var url = "/api/osinstall/v1/device/getNumByStatus";
		//生成发请求数据对象
		var data = {};
		data.Status = status;

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    getImportPriview : function(filename,limit,offset) {
        var url = "/api/osinstall/v1/device/importPriview";
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

    importDevice : function(filename) {
        var url = "/api/osinstall/v1/device/importDevice";
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

    validateSn : function(sn) {
        var url = "/api/osinstall/v1/device/validateSn";
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

});