import Ember from 'ember';

export default Ember.Route.extend({
	networkSrv: Ember.inject.service('api/manageNetwork/service'),
	model: function(params) {
        if(params.id === "new"){
            return {info:{Vlan:"",Trunk:"",Bonding:""}};
        }else{
            return Ember.RSVP.hash({
                id:params.id,
                info:this.get('networkSrv').get(params.id).then(function(data){return data.Content;}),
            });
        }
    },

    setupController: function(controller, model) {
    	controller.set("model",model);
    }
});
