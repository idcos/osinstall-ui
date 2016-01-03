import Ember from 'ember';

export default Ember.Route.extend({
	locationSrv: Ember.inject.service('api/location/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:parseInt(params.id),
			info:this.get('locationSrv').get(params.id).then(function(data){return data.Content;}),
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
