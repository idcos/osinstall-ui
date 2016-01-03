import Ember from 'ember';

export function intAdd(params) {
  return params[0] + params[1];
}

export default Ember.Helper.helper(intAdd);
