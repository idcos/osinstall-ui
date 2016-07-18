/*
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({
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

    getBySn : function(sn) {
        var url = "/api/osinstall/v1/device/getDeviceBySn?sn="+sn;

		//发送ajax请求
        return ajax({
			'method': 'GET',
			'contentType': "application/json; charset=utf-8",
			'url': url,
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
    * 导出
    */
    export : function(param) {
        var url = "/api/osinstall/v1/device/export";
		if(!Ember.isEmpty(param)){
        	url += param;
        }
		location.href = url;
		return ;
    },

    /*
    * 获取列表
    */
    scanList : function(limit,offset,form) {
        var url = "/api/osinstall/v1/device/scan/list";
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

    getScan : function(id) {
        var url = "/api/osinstall/v1/device/scan/view";
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

    getScanByDeviceId : function(deviceId) {
        var url = "/api/osinstall/v1/device/scan/viewByDeviceId";
		//生成发请求数据对象
		var data = {};
		data.DeviceID = parseInt(deviceId);

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    scanCompanyList : function() {
        var url = "/api/osinstall/v1/device/scan/company/list";
		//生成发请求数据对象
		var data = {};

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    scanProductList : function(form) {
        var url = "/api/osinstall/v1/device/scan/product/list";
		//生成发请求数据对象
		var data = form;
		
		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    scanModelNameList : function(form) {
        var url = "/api/osinstall/v1/device/scan/modelName/list";
		//生成发请求数据对象
		var data = form;
		
		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    //导出
    exportScanDevice : function(param) {
        var url = "/api/osinstall/v1/device/scan/export";
        if(!Ember.isEmpty(param)){
        	url += param;
        }
		location.href = url;
		return ;
    },

    batchAssignScanDeviceUser : function(form) {
        var url = "/api/osinstall/v1/device/scan/batchAssignOwner";
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
    batchDeleteScanDevice : function(form) {
        var url = "/api/osinstall/v1/device/scan/batchDelete";
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
    getNumByStatus : function(status,userID) {
        var url = "/api/osinstall/v1/device/getNumByStatus";
		//生成发请求数据对象
		var data = {};
		data.Status = status;
		if(!Ember.isEmpty(userID)){
			data.UserID = parseInt(userID);
		}

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

    getInstallReport : function() {
        var url = "/api/osinstall/v1/device/getInstallReport";
		//生成发请求数据对象
		var data = {};

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    reportInstallReport : function() {
        var url = "/api/osinstall/v1/device/reportInstallReport";
		//生成发请求数据对象
		var data = {};

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    getInstallCallbackList : function(deviceId) {
        var url = "/api/osinstall/v1/device/callback/list";
		//生成发请求数据对象
		var data = {};
		data.DeviceId = parseInt(deviceId)

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

});