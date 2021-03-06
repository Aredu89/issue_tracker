import React from 'react'
import { Link } from 'react-router'

export default class IssueEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      issue: {
      _id: '', title: '', status: '', owner: '', effort: '',
      completionDate: null, created: ''
      }
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()

    fetch(`/api/issues/${this.props.params.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state.issue)
    })
      .then(response => {
        if (response.ok) {
          response.json()
            .then(updatedIssue => {
              updatedIssue.created = new Date(updatedIssue.created)
              if (updatedIssue.completionDate) {
                updatedIssue.completionDate = new Date(updatedIssue.completionDate)
              }
              this.setState({issue: updatedIssue})
              alert('La tarea se modificó correctamente')
            })
        } else {
          response.json()
            .then(error => {
              alert(`La modificacion falló: ${error.message}`)
            })
        }
      })
      .catch(err => {
        alert(`Error al enviar la informacion al servidor: ${err.message}`)
      })
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.loadData()
    }
  }

  onChange(event) {
    const issue = Object.assign({}, this.state.issue)
    issue[event.target.name] = event.target.value
    this.setState({ issue })
  }

  loadData() {
    fetch(`/api/issues/${this.props.params.id}`)
      .then(response => {
        if (response.ok) {
          response.json()
          .then(issue => {
            issue.created = new Date(issue.created)
            issue.completionDate = issue.completionDate != null ?
            new Date(issue.completionDate).toDateString() : null
            issue.effort = issue.effort != null ? issue.effort.toString() : ''
            this.setState({ issue })
          })
        } else {
          response.json()
          .then(error => {
            alert(`Failed to fetch issue: ${error.message}`)
          })
        }
      })
      .catch(err => {
        alert(`Error in fetching data from server: ${err.message}`)
      })
  }

  render() {
    const issue = this.state.issue
    return (
    <div>
      <form onSubmit={this.onSubmit}>
        ID: {issue._id}
        <br />
        Created: {issue.created ? issue.created.toDateString() : ''}
        <br />
        Status: <select name="status" value={issue.status} onChange={this.onChange}>
          <option value="New">New</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Verified">Verified</option>
          <option value="Closed">Closed</option>
        </select>
        <br />
        Owner: <input name="owner" value={issue.owner} onChange={this.onChange} />
        <br />
        Effort: <input size={5} name="effort" value={issue.effort} onChange={this.onChange} required />
        <br />
        Completion Date: <input name="completionDate" 
                                value={issue.completionDate}
                                onChange={this.onChange}
        />
        <br />
        Title: <input name="title" size={50} value={issue.title} onChange={this.onChange} />
        <br />
        <button type="submit">Submit</button>
        <Link to="/issues">Back to issue list</Link>
      </form>
    </div>
    )
  }
}

IssueEdit.propTypes = {
  params: React.PropTypes.object.isRequired
}