import Ember from 'ember'

export function formatDate (params) {
  let date = params[0],
    formatType = params[1]

  let longDate = new Date(date)

  let year = longDate.getFullYear(),
    month = longDate.getMonth(),
    day = longDate.getDate(),
    hour = longDate.getHours(),
    minute = longDate.getMinutes(),
    sec = longDate.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec
}

export default Ember.Helper.helper(formatDate)
