/*
* 用户相关相关
* author:lizhongdang
* 2016-02-19
*/
import Ember from 'ember';
var ajax = Ember.$.ajax;

export default Ember.Service.extend({

    /*
    * 新增
    */
    create : function(form) {
        var url = "/api/osinstall/v1/user/add";
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
    * 获取具体信息
    */
    get : function(id) {
        var url = "/api/osinstall/v1/user/view";
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
    * 删除具体信息
    */
    deleteRowById : function(id,accessToken) {
        var url = "/api/osinstall/v1/user/delete";
		//生成发请求数据对象
		var data = {};
		data.ID = parseInt(id);
        data.AccessToken = accessToken;

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
        var url = "/api/osinstall/v1/user/update";
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

    updateMyInfo : function(form) {
        var url = "/api/osinstall/v1/user/updateMyInfo";
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
    * 修改密码
    */
    updatePassword : function(form) {
        var url = "/api/osinstall/v1/user/updatePassword";
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

    login : function(form) {
        var url = "/api/osinstall/v1/user/login";
        //生成发请求数据对象
        var data = {};
        data = form;

        //发送ajax请求
        return ajax({
            'method': 'POST',
            'contentType': "application/json; charset=utf-8",
            'url': url,
            'data': JSON.stringify(data),
            'timeout' : 3000,
             error: function (request, status, err) {
                if(status == "timeout"){
                    alert("Server端未启动或nginx api转发规则未设置成功!");
                }
            }
        }); 
    },

    createLocalSession : function(data){
    	if(typeof window.sessionStorage === 'undefined'){
    		return false;
    	}
        window.sessionStorage.setItem("osinstallAuthID",parseInt(data.ID));
    	window.sessionStorage.setItem("osinstallAuthUsername",data.Username);
    	window.sessionStorage.setItem("osinstallAuthName",data.Name);
        window.sessionStorage.setItem("osinstallAuthRole",data.Role);
    	window.sessionStorage.setItem("osinstallAuthAccessToken",data.AccessToken);
    	return true;
    },

    clearLocalSession : function(){
    	if(typeof window.sessionStorage === 'undefined'){
    		return true;
    	}
    	window.sessionStorage.clear();
    	return true;
    },

    getLocalSession : function(){
    	if(typeof window.sessionStorage === 'undefined'){
    		return null;
    	}

    	var data = {};
        data.ID = parseInt(window.sessionStorage.getItem("osinstallAuthID"));
    	data.Username = window.sessionStorage.getItem("osinstallAuthUsername");
    	data.Name = window.sessionStorage.getItem("osinstallAuthName");
        data.Role = window.sessionStorage.getItem("osinstallAuthRole");
        data.AccessToken = window.sessionStorage.getItem("osinstallAuthAccessToken");
    	data.IsShowVmFunction = window.sessionStorage.getItem("osinstallIsShowVmFunction");
    	return data;
    },

    getLocalSessionUID: function(){
        if(typeof window.sessionStorage === 'undefined'){
            return null;
        }
        
        return window.sessionStorage.getItem("osinstallAuthID");
    },

    logout : function(form) {
        var url = "/api/osinstall/v1/user/logout";
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

    /*
    * 获取列表
    */
    list : function(limit,offset,form) {
        var url = "/api/osinstall/v1/user/list";
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
    
    isLocalStorageSupported : function() {
        var testKey = 'test',
        storage = window.sessionStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    },
});