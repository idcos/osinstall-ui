import Ember from 'ember';

import breadCrumbMixin from '../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "添加位置",
        isShow:true,
    },
	locationSrv: Ember.inject.service('api/location/service'),
	model: function(params) {
        return Ember.RSVP.hash({
        	info:{Pid:parseInt(params.pid)},
        	tree:this.get("locationSrv").tree(0,parseInt(params.pid)).then(function(data) {return data.Content;}),
        });
    },

    setupController: function(controller, model) {
        var row = [];
        var data = {};
        data.ID = 0;
        data.Name = data.ShowName = "顶级位置";
        row.pushObject(data);
        if(model.tree !== null){
            Object.keys(model.tree).forEach(function (key) {
                var re = /^[0-9]*]*$/;
                if(re.test(key)){
                    row.pushObject(model.tree[key]);
                }
            });
        }
        
        model.tree = row;

    	controller.set("model",model);
    }
});
