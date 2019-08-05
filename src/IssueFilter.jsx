import React from 'react'

export default class IssueFilter extends React.Component {
  constructor() {
    super()
    this.clearFilter = this.clearFilter.bind(this)
    this.setFilterOpen = this.setFilterOpen.bind(this)
    this.setFilterAssigned = this.setFilterAssigned.bind(this)
  }

  setFilterOpen(e) {
    e.preventDefault()
    this.props.setFilter({ status: 'Abierto' })
  }

  setFilterAssigned(e) {
    e.preventDefault()
    this.props.setFilter({ status: 'Asignado' })
  }

  clearFilter(e) {
    e.preventDefault()
    this.props.setFilter({})
  }

  render() {
    const Separator = () => <span> | </span>
    return (
      <div>
        <a href="#" onClick={this.clearFilter}>Todas las tareas</a>
        <Separator />
        <a href="#" onClick={this.setFilterOpen}>
          Tareas abiertas
        </a>
        <Separator />
        <a href="#" onClick={this.setFilterAssigned}> Tareas Asignadas </a>
      </div>
    )
  }
}

IssueFilter.propTypes = {
  setFilter: React.PropTypes.func.isRequired
}