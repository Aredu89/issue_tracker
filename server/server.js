const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const Issue = require('./issue.js')
const path = require('path')

const app = express()

let db

app.use(express.static('static'))
app.use(bodyParser.json())

// Conexion a la base de datos y servidor
MongoClient.connect('mongodb://localhost/issuetracker')
  .then(connection => {
    db = connection
    app.listen(3000, () => {
      console.log('App corriendo en el puerto 3000')
    })
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

/************* API ****************/

// GET lista de issues
app.get('/api/issues', (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {}
  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10)
  if (req.query.effor_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10)

  db.collection('issues').find(filter).toArray()
    .then(issues => {
      const metadata = { total_count: issues.length }
      res.json({_metadata: metadata, records: issues})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: `Error interno del servidor: ${error}`})
    })
})

//GET Un issue
app.get('/api/issues/:id', (req, res) => {
  let issueId
  try {
    issueId = new ObjectID(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `Formato del ID invalido: ${error}` })
    return
  }
  db.collection('issues').find({ _id: issueId }).limit(1)
    .next()
    .then(issue => {
      if (!issue) res.status(404).json({ message: `No se encontro el ID: ${issueId}` })
      else res.json(issue)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Error interno del servidor: ${error}` })
    })
})

// POST crear nuevo registro
app.post('/api/issues', (req,res) => {
  const newIssue = req.body
  newIssue.created = new Date()
  
  if (!newIssue.status)
    newIssue.status = 'New'
  
  const err  = Issue.validateIssue(newIssue)
  if (err) {
    res.status(422).json({ message: `Requerimiento no valido: ${err}`})
    return
  }

  db.collection('issues').insertOne(newIssue)
    .then(result => db.collection('issues').find({_id: result.insertedId}).limit(1).next())
    .then(newIssue => {
      res.json(newIssue)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: `Error interno del servidor: ${error}`})
    })
})

//PUT modificar registro
app.put('/api/issues/:id', (req, res) => {
  let issueId
  try {
    issueId = new ObjectID(req.params.id)
  } catch (error) {
    res.status(422).json({message: `Formato de ID invalido: ${error}`})
    return
  }

  const issue = req.body
  delete issue._id

  const err = Issue.validateIssue(issue)
  if (err) {
    res.status(422).json({ message: `Formatos de fecha invalidos: ${err}` })
    return
  }

  db.collection('issues').update({ _id: issueId },Issue.convertIssue(issue)).then(() =>
    db.collection('issues').find({ _id: issueId }).limit(1)
    .next()
  )
    .then(savedIssue => {
      res.json(savedIssue)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Error interno del servidor: ${error}` })
    })
})

// DELETE eliminar registro
app.delete('/api/issues/:id', (req, res) => {
  let issueId
  try {
    issueId = new ObjectID(req.params.id)
  } catch (error) {
    res.status(422).json({ message: `ID invalido: ${error}` })
    return
  }
  db.collection('issues').deleteOne({ _id: issueId })
    .then((deleteResult) => {
      if (deleteResult.result.n === 1) res.json({ status: 'OK' })
      else res.json({ status: 'Warning: object not found' })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Error interno del servidor: ${error} `})
    })
})

// El resto de las rutas (debido a browserHistory)
app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'))
})