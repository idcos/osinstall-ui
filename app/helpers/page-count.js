import Ember from 'ember'

export function pageCount (params) {
  let [recordCount, pageSize] = params
  return Math.ceil(recordCount / pageSize)
}

export default Ember.Helper.helper(pageCount)
