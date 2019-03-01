import Ember from 'ember'

export function formatDate (params) {
  let date = params[0],
    formatType = params[1]

  return moment(date).format(formatType)
}

export default Ember.Helper.helper(formatDate)
