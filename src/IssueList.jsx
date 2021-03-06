import React from 'react'
import 'whatwg-fetch'
import { Link } from 'react-router'

import IssueAdd from './IssueAdd.jsx'
import IssueFilter from './IssueFilter.jsx'

const IssueRow = (props) => {
  function onDeleteClick() {
    props.deleteIssue(props.issue._id)
  }
  return (
    <tr>
      <td>
        <Link to={`/issues/${props.issue._id}`}>
          {props.issue._id.substr(-4)}
        </Link>
      </td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
      <td>{props.issue.title}</td>
      <td><button onClick={onDeleteClick}>Delete</button></td>
    </tr>
  )
}
IssueRow.propTypes = {
  issue_id: React.PropTypes.number.isRequired,
  issue_title: React.PropTypes.string
}
IssueRow.defaultProps = {
  issue_title: '-- no title --'
}

function IssueTable (props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue._id} issue={issue} deleteIssue={props.deleteIssue} />)
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  )
}

export default class IssueList extends React.Component {
  constructor() {
    super()
    this.state = {issues: []}

    this.createIssue = this.createIssue.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.deleteIssue = this.deleteIssue.bind(this)
  }

  deleteIssue(id) {
    fetch(`/api/issues/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) alert('Fallo la eliminación de la tarea')
        else this.loadData()
      })
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.query
    const newQuery = this.props.location.query
    if (oldQuery.status === newQuery.status
      && oldQuery.effort_gte === newQuery.effort_gte
      && oldQuery.effort_lte === newQuery.effort_lte) {
      return
    }
    this.loadData()
  }

  loadData(){
    fetch(`/api/issues${this.props.location.search}`)
      .then(response => {
        if (response.ok) {
          response.json()
          .then(data => {console.log("Total count of records: ", data._metadata.total_count)
            data.records.forEach(issue => {
              issue.created = new Date(issue.created)
              if(issue.completionDate)
                issue.completionDate = new Date(issue.completionDate)
            })
            this.setState({issues: data.records})
          })
        } else {
          response.json()
          .then(error => {
            alert("Error en el fetch de issues: " + error.message)
          })
        }
      })
      .catch(err => {
        alert("Error en el fetching a la informacion del servidor", err)
      })
  }

  createIssue(newIssue) {
    fetch('/api/issues', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newIssue)
    })
      .then(response => {
        if (response.ok) {
          response.json()
          .then(updatedIssue => {
            updatedIssue.created = new Date(updatedIssue.created)
            if (updatedIssue.completionDate) 
              updatedIssue.completionDate = new Date(updatedIssue.completionDate)
            const newIssues = this.state.issues.concat(updatedIssue)
            this.setState({issues: newIssues})
          })
        } else {
          response.json()
          .then(error => {
            alert("Falló la insersión de un nuevo registro: "+error.message)
          })
        }
      })
      .catch(err => {
        alert("Error al enviar informacion al servidor: " + err.message)
      })
  }

  setFilter(query) {
    this.props.router.push({ pathname: this.props.location.pathname, query })
  }

  render() {
    return (
      <div>
        <IssueFilter setFilter={this.setFilter}
                     initFilter={this.props.location.query} />
        <hr />
        <IssueTable issues={this.state.issues}
                    deleteIssue={this.deleteIssue} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        <hr />
      </div>
    )
  }
}

IssueList.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
  deleteIssue: React.PropTypes.func.isRequired
}