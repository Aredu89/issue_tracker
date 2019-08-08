const ADD_ISSUE = require('../constants/action-types.js').ADD_ISSUE

const initialState = {
  issues: []
}

function rootReducer(state = initialState, action) {
  if (action.type === ADD_ISSUE) {
    return Object.assign({}, state, {
      issues: state.issues.concat(action.payload)
    })
  }
  return state
}

module.exports = {
  rootReducer: rootReducer
}