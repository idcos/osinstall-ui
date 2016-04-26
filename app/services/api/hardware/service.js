/*
* 硬件配置相关
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
        var url = "/api/osinstall/v1/hardware/add";
		//生成发请求数据对象
		var data = {};
		data = form;
		//data.FormatTpl = null;

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
        var url = "/api/osinstall/v1/hardware/view";
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

    getCompanyByGroup : function() {
        var url = "/api/osinstall/v1/hardware/getCompanyByGroup";
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

    getProductByCompanyAndGroup : function(company) {
        var url = "/api/osinstall/v1/hardware/getProductByWhereAndGroup";
		//生成发请求数据对象
		var data = {};
		data.Company = company;

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    getModelNameByCompanyAndGroup : function(company,isSystemAdd) {
        var url = "/api/osinstall/v1/hardware/getModelNameByWhereAndGroup";
		//生成发请求数据对象
		var data = {};
		data.Company = company;
		data.IsSystemAdd = isSystemAdd;

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    getModelNameByCompanyAndProductAndGroup : function(company,product,isSystemAdd) {
        var url = "/api/osinstall/v1/hardware/getModelNameByWhereAndGroup";
		//生成发请求数据对象
		var data = {};
		data.Company = company;
		data.Product = product;
		data.IsSystemAdd = isSystemAdd;

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
        var url = "/api/osinstall/v1/hardware/delete";
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
        var url = "/api/osinstall/v1/hardware/update";
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

    //导出
    exportHardware : function(param) {
        var url = "/api/osinstall/v1/hardware/export";
        if(!Ember.isEmpty(param)){
        	url += param;
        }
		location.href = url;
		return ;
    },

    /*
    * 获取列表
    */
    list : function(limit,offset,company,product,modelName,isSystemAdd) {
        var url = "/api/osinstall/v1/hardware/list";
		//生成发请求数据对象
		var data = {};
		data.Limit = limit;
		data.Offset = offset;
		data.Company = company;
		data.Product = product;
		data.ModelName = modelName;
		if(!Ember.isEmpty(isSystemAdd)){
			data.IsSystemAdd = isSystemAdd;
		}

		//发送ajax请求
        return ajax({
			'method': 'POST',
			'contentType': "application/json; charset=utf-8",
			'url': url,
			'data': JSON.stringify(data),
        });
    },

    checkOnlineUpdate : function() {
        var url = "/api/osinstall/v1/hardware/checkOnlineUpdate";
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

    runOnlineUpdate : function() {
        var url = "/api/osinstall/v1/hardware/runOnlineUpdate";
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

});