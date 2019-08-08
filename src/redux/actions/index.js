const ADD_ISSUE = require('../constants/action-types.js').ADD_ISSUE

function addIssue(payload) {
  return { type: ADD_ISSUE, payload }
}

module.exports = {
  addIssue: addIssue
}