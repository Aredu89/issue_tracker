import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, hashHistory } from 'react-router'

import IssueList from './IssueList.jsx'
import IssueEdit from './IssueEdit.jsx'

//Variables
const contentNode = document.getElementById('contents')
const NoMatch = () => <p>No se encontró la página</p>

//Ruteo
const RouteApp = () => (
  <Router history={hashHistory} >
    <Redirect from="/" to="/issues" />
    <Route path="/issues" component={IssueList} />
    <Route path="/issues/:id" component={IssueEdit} />
    <Route path="*" component={NoMatch} />
  </Router>
)

ReactDOM.render(<RouteApp />, contentNode)

if (module.hot) {
  module.hot.accept()
}