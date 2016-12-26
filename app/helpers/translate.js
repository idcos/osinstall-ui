import Ember from 'ember';
import t from 'ui/utils/translate';

export function translate(params) {
	let key = params, translatedString;

	if (params.shift && params.length > 1) {
		key = params.shift();
		let vars = {};
		for (let i = 0, l = params.length; i < l; i++) {
			vars["$" + i] = params[i];
		}
		translatedString = t(key, vars);
	} else {
		translatedString = t(key);
	}

	return Ember.String.htmlSafe(translatedString);
}

export default Ember.Helper.helper(translate);