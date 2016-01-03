/**
 * site navigation bar
 */
import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement: function() {
		var $navSubLis = this.$('.nav-sub>li')
		this.$('>.nav>li>a').on('click', function() {
			$(this).parent().toggleClass('active');
		})
		this.$('.nav-sub>li>a').on('click', function() {
			$navSubLis.removeClass('active')
			$(this).parent().toggleClass('active')
		})
	}
});
