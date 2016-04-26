import config from '../../config/environment';
import Ember from 'ember';
import breadCrumbMixin from '../../mixins/bread-crumb-mixin';

export default Ember.Route.extend(breadCrumbMixin, {
    breadCrumb: {
        title: "控制台",
        isShow:true,
    },
    afterModel: function(){
        this.transitionTo("dashboard.main");
        this.transitionTo(config.defaultRoute);
    }
});
