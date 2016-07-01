/*
* author:lizhongdang
* 2015-11-24
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({

    /*
    * 创建新的Mac地址
    */
    createNewMacAddress : function() {
        var url = "/api/osinstall/v1/vm/createNewMacAddress";
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

    batchAdd : function(data) {
        var url = "/api/osinstall/v1/vm/batchAdd";
        //生成发请求数据对象

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
        var url = "/api/osinstall/v1/vm/batchReInstallVm";
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
        var url = "/api/osinstall/v1/vm/batchDeleteVm";
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


    create : function(form) {
        var url = "/api/osinstall/v1/vm/add";
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
        var url = "/api/osinstall/v1/vm/list";
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
    * 获取具体信息
    */
    get : function(id) {
        var url = "/api/osinstall/v1/vm/viewFull";
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

    batchStart : function(form) {
        var url = "/api/osinstall/v1/vm/batchStart";
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

    batchStop : function(form) {
        var url = "/api/osinstall/v1/vm/batchStop";
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

    batchReStart : function(form) {
        var url = "/api/osinstall/v1/vm/batchReStart";
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

});