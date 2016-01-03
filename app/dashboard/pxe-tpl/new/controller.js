import Ember from 'ember';

export default Ember.Controller.extend({
	actions:{
		saveAction:function(){
			this.transitionToRoute("dashboard.pxeTpl.list");
		}
	}
});
