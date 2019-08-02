'use strict'

// Validaciones
const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true
}
const issueFieldType = {
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required'
}
function validateIssue(issue) {
  for (const field in issueFieldType) {
    const type = issueFieldType[field]
    if (!type) {
      delete issue[field]
    } else if (type === 'required' && !issue[field]) {
      return `${field} es requerido`
    }
  }
  if (!validIssueStatus[issue.status])
    return `${issue.status} no es un estado valido.`
  
  return null
}

module.exports = {
  validateIssue: validateIssue
}