/*
* 位置模型相关
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
        var url = "/api/osinstall/v1/location/add";
		//生成发请求数据对象
		var data = {};
		data = form;
		//data.Pid = parseInt(form.Pid);

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    /*
    * 获取具体信息
    */
    get : function(id) {
        var url = "/api/osinstall/v1/location/view";
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


    getLocationTreeNameById : function(id) {
        var url = "/api/osinstall/v1/location/getLocationTreeNameById";
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
    * 获取具体信息
    */
    tree : function(pid,selectPid) {
        var url = "/api/osinstall/v1/location/tree";
		//生成发请求数据对象
		var data = {};
		data.Pid = parseInt(pid);
		data.SelectPid = parseInt(selectPid);

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    /*
    * 删除具体信息
    */
    deleteRowById : function(id) {
        var url = "/api/osinstall/v1/location/delete";
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
        var url = "/api/osinstall/v1/location/update";
		//生成发请求数据对象
		var data = {};
		data = form;
		//data.Pid = parseInt(form.Pid);

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
    list : function(limit,offset,pid) {
        var url = "/api/osinstall/v1/location/list";
		//生成发请求数据对象
		var data = {};
		data.Limit = limit;
		data.Offset = offset;
		data.Pid = parseInt(pid);

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

});