const pool = require('./config.js')

const getReviews = (cb) => {
  const sql = 'SELECT * FROM'
  pool.query(sql, (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res);
    }
  })
}

const getReviewsMeta = (cb) => {
  const sql = 'SELECT * FROM'
  pool.query(sql, (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res);
    }
  })
}