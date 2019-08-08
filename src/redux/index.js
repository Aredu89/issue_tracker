const store = require('./store/index.js').store
const addIssue = require('./actions/index.js').addIssue

module.exports = {
  store: store,
  addIssue: addIssue
}