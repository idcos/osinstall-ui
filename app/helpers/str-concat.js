import Ember from 'ember';

export function strConcat(param) {
  return parseInt(param[0]) + "_" + param[1];
}

export default Ember.Helper.helper(strConcat);
