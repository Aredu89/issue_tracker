//ubicarse en Program Files\MongoDB\Server\4.0\bin
//correr $ mongo init.mongo.js

db = new Mongo().getDB('issuetracker')

db.issues.remove({})

db.issues.insert([
  {
    status: 'Open', 
    owner: 'Ravan',
    created: new Date('2016-08-15'), 
    effort: 5, 
    completionDate: undefined,
    title: 'Error in console when clicking Add'
  },
  {
    status: 'Assigned', 
    owner: 'Eddie',
    created: new Date('2016-08-16'), 
    effort: 14,
    completionDate: new Date('2016-08-30'),
    title: 'Missing bottom border on panel'
  },
  {
    status: 'Fixed', 
    owner: 'John',
    created: new Date('2016-08-18'), 
    effort: 8,
    completionDate: new Date('2016-08-30'),
    title: 'Fixing the log messages'
  }
])

db.issues.createIndex({status:1})
db.issues.createIndex({owner:1})
db.issues.createIndex({created:1})