import Ember from 'ember';

export function nl2br(str) {
	//console.log(str.replace(/\n/g,'<br />'));
	return str.replace(/\n/g,'<br />');
}

export default Ember.Helper.helper(nl2br);
