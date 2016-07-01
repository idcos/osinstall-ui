import Ember from 'ember';

export function divide(params) {
	var result = Math.round(params[0]/params[1]);
	if(result < 0){
		result = 0;
	}
	return Math.round(params[0]/params[1]);
}

export default Ember.Helper.helper(divide);
