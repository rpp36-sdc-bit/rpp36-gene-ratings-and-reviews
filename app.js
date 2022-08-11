//app.js
const express = require('express')
const app = express()

//PostgreSQL database
const db = require('./database/sql')

// //MongoDB database
// const db = require('./database/nosql/mongoDBSchema.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;