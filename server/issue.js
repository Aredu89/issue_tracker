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

function cleanupIssue(issue) {
  const cleanedUpIssue = {}
  Object.keys(issue).forEach(field => {
    if (issueFieldType[field]) cleanedUpIssue[field] = issue[field]
  })
  return cleanedUpIssue
}

function convertIssue(issue) {
  if (issue.created) issue.created = new Date(issue.created)
  if (issue.completionDate) issue.completionDate = new Date(issue.completionDate)
  return cleanupIssue(issue)
}

module.exports = {
  validateIssue: validateIssue,
  convertIssue: convertIssue,
  cleanupIssue: cleanupIssue
}