import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, browserHistory, withRouter } from 'react-router'

import IssueList from './IssueList.jsx'
import IssueEdit from './IssueEdit.jsx'

//Variables
const contentNode = document.getElementById('contents')
const NoMatch = () => <p>No se encontró la página</p>

const App = (props) => (
  <div>
    <div className="header">
      <h1>Issue Tracker</h1>
    </div>
    <div className="contents">
      {props.children}
    </div>
    <div className="footer">
      El codigo fuente original se encuentra en: <a href="https://github.com/vasansr/pro-mern-stack">PRO-MERN</a>
      <br/>
      El codigo fuente de Ariel Rosales se encuentra en: <a href="https://github.com/Aredu89/issue_tracker">Issue-Tracker</a>
    </div>
  </div>
)
App.propTypes = {
  children: React.PropTypes.object.isRequired
}

//Ruteo
const RouteApp = () => (
  <Router history={browserHistory} >
    <Redirect from="/" to="/issues" />
    <Route path="/" component={App} >
      <Route path="/issues" component={withRouter(IssueList)} />
      <Route path="/issues/:id" component={IssueEdit} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>
)

ReactDOM.render(<RouteApp />, contentNode)

if (module.hot) {
  module.hot.accept()
}