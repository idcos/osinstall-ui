import Ember from 'ember';

export function strReplaceRisk(str) {
	return str[0].replace(/:/g, "_")
}

export default Ember.Helper.helper(strReplaceRisk);
