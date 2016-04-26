import Ember from 'ember';

export default Ember.Route.extend({
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
			info:this.get('hardwareSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
        if(!Ember.isEmpty(model.info.Data)){
            model.info.FormatData = $.parseJSON(model.info.Data);
        }
    	//model.info.FormatTpl = $.parseJSON(model.info.Tpl);
    	
    	controller.set("model",model);
    }
});