//app.js
const express = require('express')
const app = express()

//PostgreSQL database
const db = require('./database/sql/index.js')
const pgETL = require('./database/sql/pgETL.js')

// //MongoDB database
// const db = require('./database/nosql/mongoDBSchema.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/importreviewcsv', (req, res) => {
  pgETL.importreviews();
  res.send('imported reviews csv')
})

app.post('/importphotoscsv', (req, res) => {
  pgETL.importphotos();
  res.send('imported photos csv')
})

app.post('/importcharcsv', (req, res) => {
  pgETL.importchar();
  res.send('imported characteristics csv')
})

app.post('/importcharreviewcsv', (req, res) => {
  pgETL.importcharReview();
  res.send('imported characteristics reviews csv')
})

module.exports = app;