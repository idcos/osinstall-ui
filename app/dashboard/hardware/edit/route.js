import Ember from 'ember';

export default Ember.Route.extend({
	hardwareSrv: Ember.inject.service('api/hardware/service'),
	model: function(params) {
        return Ember.RSVP.hash({id:params.id,
            companyData:[{name:"Dell"},{name:"惠普"},{name:"IBM"},{name:"联想"},{name:"华为"},{name:"浪潮"},{name:"H3C"},{name:"宝德"}],
			info:this.get('hardwareSrv').get(params.id).then(function(data){return data.Content;}),
		});
    },

    setupController: function(controller, model) {
    	model.info.FormatTpl = $.parseJSON(model.info.Tpl);
        console.log(model.info.FormatTpl);
    	controller.set("model",model);
    }
});