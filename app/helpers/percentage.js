import Ember from 'ember';

export function percentage(num) {
  return Math.round(parseFloat(num)*100) + "%";
}

export default Ember.Helper.helper(percentage);