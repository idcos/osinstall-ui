import Ember from 'ember';

import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "添加设备型号",
        isShow:true,
    },
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function(params) {
        if(params.id === "new"){
            return Ember.RSVP.hash({
                typeData:[{name:"下拉框",value:"select"},{name:"输入框",value:"input"}],
                companyData:[{name:"Dell",id:"dell"},{name:"惠普",id:"hp"},{name:"IBM",id:"ibm"},{name:"联想",id:"lenovo"},{name:"华为",id:"huawei"},{name:"浪潮",id:"inspur"},{name:"H3C",id:"h3c"},{name:"宝德",id:"powerleader"}],
                //info:{Tpl:'[{"name":"RAID","data":[{"name":"RAID","type":"select","data":[{"name":"RAID0","value":"","checked":false},{"name":"RAID1","value":"","checked":false},{"name":"RAID5","value":"","checked":false},{"name":"RAID10","value":"","checked":true}],"default":""}]},{"name":"OOB","data":[{"name":"网络类型","type":"select","data":[{"name":"DHCP","value":"","checked":false},{"name":"静态IP","value":"","checked":true}],"default":""},{"name":"用户名","type":"input","tpl":"","default":"","input":""},{"name":"密码","type":"input","tpl":"","default":"","input":""}]},{"name":"BIOS","data":[{"name":"VT","type":"select","data":[{"name":"ON","value":"","checked":false},{"name":"OFF","value":"","checked":true}],"default":""},{"name":"C-States","type":"select","data":[{"name":"ON","value":"","checked":false},{"name":"OFF","value":"","checked":true}],"default":""}]}]',Data:null}
                info:{Tpl:'[{"name":"RAID","data":[{"name":"RAID","type":"select","data":[{"name":"RAID0","value":"/opt/yunji/osinstall/dell/raid.sh -c -l 0","checked":false},{"name":"RAID1","value":"/opt/yunji/osinstall/dell/raid.sh -c -l 1","checked":false},{"name":"RAID5","value":"/opt/yunji/osinstall/dell/raid.sh -c -l 5","checked":false},{"name":"RAID10","value":"/opt/yunji/osinstall/dell/raid.sh -c -l 10","checked":true}],"default":"/opt/yunji/osinstall/dell/raid.sh -c -l 10"}]},{"name":"OOB","data":[{"name":"网络类型","type":"select","data":[{"name":"DHCP","value":"/opt/yunji/osinstall/dell/oob.sh -n dhcp","checked":false},{"name":"静态IP","value":"/opt/yunji/osinstall/dell/oob.sh -n static -i <{manage_ip}> -m <{manage_netmask}> -g <{manage_gateway}>","checked":true}],"default":"/opt/yunji/osinstall/dell/oob.sh -n static -i <{manage_ip}> -m <{manage_netmask}> -g <{manage_gateway}>"},{"name":"用户名","type":"input","tpl":"/opt/yunji/osinstall/dell/oob.sh -u <{##}>","default":"/opt/yunji/osinstall/dell/oob.sh -u root","input":"root"},{"name":"密码","type":"input","tpl":"/opt/yunji/osinstall/dell/oob.sh -p <{##}>","default":"/opt/yunji/osinstall/dell/oob.sh -p calvin","input":"calvin"}]}]'},
            });
        }else{
            return Ember.RSVP.hash({
                id:params.id,
                typeData:[{name:"下拉框",value:"select"},{name:"输入框",value:"input"}],
                companyData:[{name:"Dell"},{name:"惠普"},{name:"IBM"},{name:"联想"},{name:"华为"},{name:"浪潮"},{name:"H3C"},{name:"宝德"}],
                info:this.get('hardwareSrv').get(params.id).then(function(data){return data.Content;}),
            });
        }
    },

    setupController: function(controller, model) {
        if(model.info.Tpl !== null && !Ember.isEmpty(model.info.Tpl)){
            model.info.FormatTpl = $.parseJSON(model.info.Tpl);
        }
    	
    	controller.set("model",model);
    }
});
