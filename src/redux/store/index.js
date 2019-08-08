const redux = require('redux')
const rootReducer = require('../reducers/index.js').rootReducer

const store = redux.createStore(rootReducer)

module.exports = {
  store: store
}