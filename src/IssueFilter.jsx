import React from 'react'
import { Link } from 'react-router'

export default class IssueFilter extends React.Component {
  render() {
    const Separator = () => <span> | </span>
    return (
      <div>
        <Link to="/issues">Todas las tareas</Link>
        <Separator />
        <Link to={{ pathname: '/issues', query: { status: 'Abierto' }}}>
          Tareas abiertas
        </Link>
        <Separator />
        <Link to="/issues?status=Asignado"> Tareas Asignadas </Link>
      </div>
    )
  }
}