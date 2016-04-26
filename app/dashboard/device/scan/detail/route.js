import Ember from 'ember';

import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "查看新设备详情",
        isShow:true,
    },
	deviceSrv: Ember.inject.service('api/device/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('deviceSrv').getScan(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	var row = model.info;
        
    	if(!Ember.isEmpty(row.Cpu)){
        	row.CpuFormat = $.parseJSON(row.Cpu);  
        }

        if(!Ember.isEmpty(row.Memory)){
        	row.MemoryFormat = $.parseJSON(row.Memory);
            /*
            var SizeSum = 0;
            if(!Ember.isEmpty(row.MemoryFormat.length) && row.MemoryFormat.length > 0){
            	for(var j=0;j<row.MemoryFormat.length;j++){
                	SizeSum += parseInt(row.MemoryFormat[j].Size);
                }
            }
            row.MemorySum = SizeSum;
            */
        }

        if(!Ember.isEmpty(row.Disk)){
        	row.DiskFormat = $.parseJSON(row.Disk);
            /*
            var SizeSum = 0;
            if(!Ember.isEmpty(row.DiskFormat.length) && row.DiskFormat.length > 0){
            	for(var j=0;j<row.DiskFormat.length;j++){
                	SizeSum += parseInt(row.DiskFormat[j].Size);
                }
            }
            row.DiskSum = SizeSum;
            */
        }

        if(!Ember.isEmpty(row.Nic)){
       		row.NicFormat = $.parseJSON(row.Nic);
        }

        if(!Ember.isEmpty(row.Motherboard)){
       		row.MotherboardFormat = $.parseJSON(row.Motherboard);
        }
    	controller.set("item",row);
    }
});
