import Ember from 'ember';

export function getColorByRelativeValue(params) {
	var result = Math.round(parseFloat(params[0]/params[1])*100);
	if(result < 0){
		result = 0;
	}
	if(result > 100){
		result = 100;
	}
	var color = "progress-bar-success";
	if(result >= 70 && result < 90){
		color = "progress-bar-warning";
	}
	if(result >= 90){
		color = "progress-bar-danger";
	}
	return color;
}

export default Ember.Helper.helper(getColorByRelativeValue);
