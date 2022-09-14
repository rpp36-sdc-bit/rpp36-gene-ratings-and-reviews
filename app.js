//app.js
const express = require('express')
const app = express()

//PostgreSQL database
const db = require('./database/sql/index.js')
// const pgETL = require('./database/sql/pgETL.js')
// const pgETLmeta = require('./database/sql/pgETLmeta.js')

// //MongoDB database
// const db = require('./database/nosql/mongoDBSchema.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/reviews', (req, res) => {
  db.reviews(req.query, (error, data) => {
    if (error) {
      res.status(400).send(error)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/reviews/meta', (req, res) => {
  db.metaAlt(req.query, (error, data) => {
    if (error) {
      res.status(400).send(error)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/reviews/meta/alt', (req, res) => {
  db.meta(req.query, (error, data) => {
    if (error) {
      res.status(400).send(error)
    } else {
      res.status(200).send(data)
    }
  })
})

app.post('/reviews', (req, res) => {
  db.post(req.body, (error, data) => {
    if (error) {
      res.status(400).send(error)
    } else {
      res.status(201).send(data)
    }
  })
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log(req.params)
  res.status(204).send()
})

app.put('/reviews/:review_id/report', (req, res) => {
  console.log(req.params)
  res.status(204).send()
})

// import legacy data routes (DEPRECIATED - use pg csv copy from pgETL.sql)
// app.post('/importreviewcsv', (req, res) => {
//   pgETL.importreviews()
//   res.send('importing reviews csv')
// })

// app.post('/importphotoscsv', (req, res) => {
//   pgETL.importphotos()
//   res.send('importing photos csv')
// })

// app.post('/importcharcsv', (req, res) => {
//   pgETL.importchar()
//   res.send('importing characteristics csv')
// })

// app.post('/importcharreviewcsv', (req, res) => {
//   pgETL.importcharReview()
//   res.send('importing characteristics reviews csv')
// })

// app.post('/updateproductmeta', (req, res) => {
//   console.log(`$-----Product Metadata generation started-----$`)
//   let startTime = new Date()
//   pgETLmeta.updateProductMetaAll(10,1,startTime)
//   res.send('updating product meta')
// })

module.exports = app;