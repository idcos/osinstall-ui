import Ember from 'ember';

export default Ember.Mixin.create({
    renderTemplate: function(controller, model) {
        this._super(controller, model);

        this.render("dashboard.breadcrumb", {
            controller: controller,
            into: "dashboard",
            outlet: "breadcrumb"
        });
    }
});
