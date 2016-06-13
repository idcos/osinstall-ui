import Ember from 'ember';

export function getPercentageByRelativeValue(params) {
	var result = Math.round(parseFloat(params[0]/params[1])*100);
	if(result < 0){
		result = 0;
	}
	if(result > 100){
		result = 100;
	}
	return result + "%";
}

export default Ember.Helper.helper(getPercentageByRelativeValue);
