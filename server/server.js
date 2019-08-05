const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
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

// El resto de las rutas (debido a browserHistory)
app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'))
})