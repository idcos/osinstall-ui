import Ember from 'ember';
import breadCrumbMixin from '../../mixins/bread-crumb-mixin';
export default Ember.Route.extend(breadCrumbMixin,{
    breadCrumb: {
        title: "物理机管理",
        isShow:false,
    }
});
