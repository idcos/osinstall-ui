/*
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({

    /*
    * 新增
    */
    create : function(form) {
        var url = "/api/osinstall/v1/manageNetwork/add";
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
    * 获取详细信息
    */
    get : function(id) {
        var url = "/api/osinstall/v1/manageNetwork/view";
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
    * 匹配IP
    */
    validateIp : function(ip) {
        var url = "/api/osinstall/v1/manageNetwork/validateIp";
		//生成发请求数据对象
		var data = {};
		data.Ip = ip

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },


    /*
    * 获取cidr信息
    */
    getCidrInfoByNetwork : function(network) {
        var url = "/api/osinstall/v1/network/cidr/get";
		//生成发请求数据对象
		var data = {};
		data.Network = network;

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    /*
    * 删除
    */
    deleteRowById : function(id) {
        var url = "/api/osinstall/v1/manageNetwork/delete";
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
    * 修改
    */
    update : function(form) {
        var url = "/api/osinstall/v1/manageNetwork/update";
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
        var url = "/api/osinstall/v1/manageNetwork/list";
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