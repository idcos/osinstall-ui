import Ember from 'ember';

import breadCrumbMixin from '../../../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "发现新设备",
        isShow:true,
    },
	userSrv: Ember.inject.service('api/user/service'),
	form:{Status:"Enable"},
	model: function() {
        return Ember.RSVP.hash({
			calculateRule:[{id:">",name:"大于"},{id:"=",name:"等于"},{id:"<",name:"小于"},{id:"!=",name:"不等于"}],
			selectUserID:null,
			isShowAssignUserModal:false,
			userData:this.get('userSrv').list(10000,0,{Status:"Enable"}).then(function(data){return data.Content.list;}),
		});
    },

	setupController: function(controller, model) {
		controller.set("model",model);
		
		var form = {Status:status,OsID:null,HardwareID:null,SystemID:null,Keyword:null};
    	controller.send("queryAction",form);
    	controller.send("queryCompanyAction");

    	var session = this.get("userSrv").getLocalSession();
        if(Ember.isEmpty(session)){
            this.get('controller').transitionToRoute('login');
        }else{
            if(Ember.isEmpty(session.Username) || Ember.isEmpty(session.Role)){
                this.get('controller').transitionToRoute('login');
            }
        }
        model.session = session;
	}
});