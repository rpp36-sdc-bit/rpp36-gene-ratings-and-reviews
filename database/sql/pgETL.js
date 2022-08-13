const pool = require('./config.js')
const events = require('events')
const fs = require('fs')
const readline = require('readline')
const path = require('path')
const reviewsPath = '../../data/sample/reviews.sample.csv'
const reviewsphotosPath = '../../data/sample/reviews_photos.sample.csv'
const charPath = '../../data/sample/characteristics.sample.csv'
const charReviewPath = '../../data/sample/characteristic_reviews.sample.csv'

// read csv files line by line
const csvimport = async function (pginsert, csvpath, tablename) {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(__dirname, csvpath)),
      crlfDelay: Infinity
    });
    let fl = true

    rl.on('line', (line) => {
      if (fl) {
        fl = false
      } else {
        const data = line.split(',')
          pginsert(data);
      }
    });

    await events.once(rl, 'close')

    console.log(`readfile ${tablename} line by line complete`);
  } catch (err) {
    console.error(err)
  }
}

//pg transform and load into db
const reviewInsert = (data) => {
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
        .then((res) => {})
        .catch(e => console.error(e.stack))
    })
    .catch(e => console.error(e.stack))
}

const importreviews = () => {
  csvimport(reviewInsert, reviewsPath, 'reviews')
}

const photoInsert = (data) => {
  const insertPhotos = {
    text: 'INSERT INTO photos(id, reviewid, url) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    values: data
  }
  pool
    .query(insertPhotos)
    .then(() => {})
    .catch(e => console.error(e.stack))
}

const importphotos = () => {
  csvimport(photoInsert, reviewsphotosPath, 'review_photos')
}

const charInsert = (data) => {
  const insertChar = {
    text: 'INSERT INTO characteristics(id, productid, name) VALUES ($1, $2, $3) \
     ON CONFLICT DO NOTHING',
    values: [data[0], data[1], data[2]]
  }
  pool
    .query(insertChar)
    .then(() => {})
    .catch(e => console.error(e.stack))
}

const importchar = () => {
  csvimport(charInsert, charPath, 'characteristics')
}

const charReviewInsert = (data) => {
  const insertCharReview = {
    text: 'INSERT INTO characteristicsreviews(id, characteristicid, reviewid, value) \
    VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
    values: data
  }
  pool
    .query(insertCharReview)
    .then(() => {})
    .catch(e => console.error(e.stack))
}

const importcharReview = () => {
  csvimport(charReviewInsert, charReviewPath, 'characteristic_reviews')
}

module.exports.importreviews = importreviews
module.exports.importphotos = importphotos
module.exports.importchar = importchar
module.exports.importcharReview = importcharReview

