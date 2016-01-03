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

});