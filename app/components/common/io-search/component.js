import Ember from 'ember';

export default Ember.Component.extend({
    method: null,
    action: null,
    placeholder: null,
    tips: null,
    query: null,

    didInsertElement: function() {
        if (Ember.isEmpty(this.get("method"))) {
            this.set("method", "GET");
        }

        if (Ember.isEmpty(this.get("action"))) {
            this.set("action", "actionSearch");
        }

        if (Ember.isEmpty(this.get("placeholder"))) {
            this.set("placeholder", "搜索...");
        }

        if (Ember.isEmpty(this.get("tips"))) {
            this.set("tips", "按回车键搜索");
        }
    },

    didDestoryElement: function() {
        this.setProperties({
            method: null,
            action: null,
            placeholder: null,
            query: null,
            tips: null
        });
    },

    actions: {
        search: function(query) {
            this.sendAction("action", query);
        }
    }
});
