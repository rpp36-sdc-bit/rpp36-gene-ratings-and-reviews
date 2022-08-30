const pool = require('./config.js')
const es = require('event-stream')
const fs = require('fs')
const path = require('path')
//sample data paths
// const reviewsPath = '../../data/sample/reviews.sample.csv'
// const reviewsphotosPath = '../../data/sample/reviews_photos.sample.csv'
// const charPath = '../../data/sample/characteristics.sample.csv'
// const charReviewPath = '../../data/sample/characteristic_reviews.sample.csv'

// legacy data paths
const reviewsPath = '../../data/legacy/reviews.csv'
const reviewsphotosPath = '../../data/legacy/reviews_photos.csv'
const charPath = '../../data/legacy/characteristics.csv'
const charReviewPath = '../../data/legacy/characteristic_reviews.csv'

// read in csv files and insert into DB line by line
const csvimport = async function (pginsert, csvpath, tablename) {
  const startTime = new Date()
  console.log(`$-----ETL of ${tablename} started-----$`)
  let fl = true
  let cr = 0
  const rl = fs.createReadStream(path.join(__dirname, csvpath))
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {
      cr += 1
      process.stdout.write(`processing current row: ${cr}\r`)
      rl.pause()
      if (fl) {
        fl = false
        rl.resume()
      } else {
        const data = line.split(',')
        pginsert(data,startTime, () => {
          rl.resume()
        })
      }
    }))
}

//pg transform and load into db
const reviewInsert = (data, startTime, cb) => {
  const insertProd = {
    text: 'INSERT INTO products(id) VALUES ($1) ON CONFLICT DO NOTHING',
    values: [data[1]]
  }
  pool
    .query(insertProd)
    .then(() => {
      const insertReview = {
        text: 'INSERT INTO reviews(id, productid, ratings, summary, recommend, \
          reported, response, body, date, reviewername, revieweremail, helpfulness) \
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9), $10, $11, $12) \
          ON CONFLICT DO NOTHING',
        values: [data[0], data[1], data[2], data[4], data[6], data[7], data[10],
          data[5], data[3]/1000.0, data[8], data[9], data[11]]
      }
      pool
        .query(insertReview)
        .then((res) => {
          cb()
          //last line sample data = '12', legacy = '5774952'
          // if (data[0] === '12') {
          if (data[0] === '5774952') {
            const endTime = new Date()
            const elapsedTime = ((endTime - startTime)/1000/60).toFixed(4)
            console.log(`$-----ETL of reviews complete-----$`)
            console.log(`$-----Elapsed Time: ${elapsedTime} minutes-----$`)
          }
        })
        .catch(e => {
          cb()
          console.error(
            `$-----ERROR-----$
            reviewid = ${data[0]}
            productid = ${data[1]}
            ${e.stack}`
          )
        })
    })
    .catch(e => console.error(e.stack))
}

const importreviews = () => {
  csvimport(reviewInsert, reviewsPath, 'reviews')
}

const photoInsert = (data, startTime, cb) => {
  const insertPhotos = {
    text: 'INSERT INTO photos(id, reviewid, url) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    values: data
  }
  pool
    .query(insertPhotos)
    .then(() => {
      cb()
      //last line sample data = '9', legacy = '2742540'
      // if (data[0] === '9') {
      if (data[0] === '2742540') {
        const endTime = new Date()
        const elapsedTime = ((endTime - startTime)/1000/60).toFixed(4)
        console.log(`$-----ETL of review_photos complete-----$`)
        console.log(`$-----Elapsed Time: ${elapsedTime} minutes-----$`)
      }
    })
    .catch(e => {
      cb()
      console.error(
        `$-----ERROR-----$
        photoid = ${data[0]}
        reviewid = ${data[1]}
        ${e.stack}`
      )
    })
}

const importphotos = () => {
  csvimport(photoInsert, reviewsphotosPath, 'review_photos')
}

const charInsert = (data, startTime, cb) => {
  const insertChar = {
    text: 'INSERT INTO characteristics(id, productid, name) VALUES ($1, $2, $3) \
     ON CONFLICT DO NOTHING',
    values: [data[0], data[1], data[2]]
  }
  pool
    .query(insertChar)
    .then(() => {
      cb()
      //last line sample data = '17', legacy = '3347679'
      // if (data[0] === '17') {
      if (data[0] === '3347679') {
        const endTime = new Date()
        const elapsedTime = ((endTime - startTime)/1000/60).toFixed(4)
        console.log(`$-----ETL of characteristics complete-----$`)
        console.log(`$-----Elapsed Time: ${elapsedTime} minutes-----$`)
      }
    })
    .catch(e => {
      cb()
      console.error(
        `$-----ERROR-----$
        charid = ${data[0]}
        productid = ${data[1]}
        ${e.stack}`
      )
    })
}

const importchar = () => {
  csvimport(charInsert, charPath, 'characteristics')
}

const charReviewInsert = (data, startTime, cb) => {
  const insertCharReview = {
    text: 'INSERT INTO characteristicsreviews(id, characteristicid, reviewid, value) \
    VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
    values: data
  }
  pool
    .query(insertCharReview)
    .then(() => {
      cb()
      //last line sample data = '33', legacy = '19327575'
      // if (data[0] === '33') {
      if (data[0] === '19327575') {
        const endTime = new Date()
        const elapsedTime = ((endTime - startTime)/1000/60).toFixed(4)
        console.log(`$-----ETL of characteristic_reviews complete-----$`)
        console.log(`$-----Elapsed Time: ${elapsedTime} minutes-----$`)
      }
    })
    .catch(e => {
      cb()
      console.error(
        `$-----ERROR-----$
        charreviewid = ${data[0]}
        charid = ${data[1]}
        reviewid = ${data[2]}
        ${e.stack}`
      )
    })
}

const importcharReview = () => {
  csvimport(charReviewInsert, charReviewPath, 'characteristic_reviews')
}

module.exports.importreviews = importreviews
module.exports.importphotos = importphotos
module.exports.importchar = importchar
module.exports.importcharReview = importcharReview

