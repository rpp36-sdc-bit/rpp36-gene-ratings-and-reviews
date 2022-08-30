const pool = require('./config.js')

const getReviews = (productid, orderby, cb) => {
  ordertext = 'ORDER BY helpfulness DESC'
  if (orderby === 'newest') {
    ordertext = 'ORDER BY date DESC'
  }
  const startTime = new Date()
  const reviews = {
    text: 'SELECT reviews.id as reviewsid, reviews.ratings, reviews.summary, reviews.recommend, \
    reviews.reported, reviews.response, reviews.body, reviews.date, reviews.reviewername, \
    reviews.helpfulness, photos.id as photosid, photos.url FROM reviews \
    LEFT OUTER JOIN photos on photos.reviewid = reviews.id WHERE productid = $1' + ordertext,
    values: [productid]
  }
  pool
    .query(reviews)
    .then((res) => {
      const data = res.rows
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      cb(null, data)
    })
    .catch(e => {
      console.error(e.stack)
      cb(e.stack, null)
    })
}

// Method 1: product metadata precalculated and stored directly in Product db table
const getReviewsProdMeta = (productid, cb) => {
  const startTime = new Date()
  const prodMeta = {
    text: 'SELECT totalreviews, ratings1, ratings2, ratings3, ratings4, ratings5, \
    recommendfalse, recommendtrue FROM products where id = $1',
    values: [productid]
  }
  pool
    .query(prodMeta)
    .then((res) => {
      const data = res.rows
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      cb(null, data)
    })
    .catch(e => {
      console.error(e.stack)
      cb(e.stack, null)
    })
}

// Method 2: query reviews and calculate product metadata
const queryProductMeta = (productid, cb) => {
  const startTime = new Date()
  const prodLookUp = {
    text: 'SELECT ratings, recommend FROM reviews WHERE productid = $1',
    values: [productid]
  }
  pool
    .query(prodLookUp)
    .then((res) => {
      const data = res.rows;
      let reviewCount = data.length;
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      if (reviewCount > 0) {
        let product = {
          id: productid,
          totalreviews: reviewCount,
          ratings1: 0,
          ratings2: 0,
          ratings3: 0,
          ratings4: 0,
          ratings5: 0,
          recommendfalse: 0,
          recommendtrue: 0
        }
        data.forEach(row => {
          let reviewRating = 'ratings' + row.ratings
          product[reviewRating] = product[reviewRating] + 1
          if (row.recommend) {
            product.recommendtrue = product.recommendtrue + 1
          } else {
            product.recommendfalse = product.recommendfalse + 1
          }
        })
        cb(null, product)
      } else {
        cb(null, {})
      }
    })
    .catch(e => {
      console.error(e.stack)
      cb(e.stack, null)
    })
}

// Method 1: Characteristic metadata stored directly on Characteristics db table
const getReviewsCharMeta = (productid, cb) => {
  const startTime = new Date()
  const charMeta = {
    text: 'SELECT id, name, rating FROM characteristics WHERE productid = $1',
    values: [productid]
  }
  pool
    .query(charMeta)
    .then((res) => {
      const data = res.rows
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      cb(null, data)
    })
    .catch(e => {
      console.error(e.stack)
      cb(e.stack, null)
    })
}

// Method 2: query characteristics and calculate characteristics metadata
const queryCharMeta = (productid, cb) => {
  const startTime = new Date()
  const charMeta = {
    text: 'SELECT characteristics.id, name, value FROM characteristics LEFT OUTER JOIN \
    characteristicsreviews on characteristics.id = characteristicsreviews.characteristicid \
    WHERE productid = $1',
    values: [productid]
  }
  pool
    .query(charMeta)
    .then((res) => {
      const data = res.rows
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      let chars = {}
      let charids = {}
      data.forEach(row => {
        row.name = row.name.substring(1, row.name.length - 1)
        if (chars[row.name]) {
          chars[row.name].push(row.value)
        } else {
          chars[row.name] = [row.value]
          charids[row.name] = row.id
        }
      })
      for (const [key, value] of Object.entries(chars)) {
        let sum = value.reduce((sum, a) => sum + a, 0)
        let total = value.length
        let avg =  sum / total
        chars[key] = {id: charids[key], value: avg}
      }
      cb(null, chars)
    })
    .catch(e => {
      console.error(e.stack)
      cb(e.stack, null)
    })
}

const postReview = (review, cb) => {
  const startTime = new Date()
  const getlastReviewid = {
    text: 'SELECT id from reviews order by id desc limit 1'
  }
  pool
    .query(getlastReviewid)
    .then((res) => {
      const newReviewid = res.rows[0].id + 1
      const insertReview = {
        text: 'INSERT INTO reviews(id, productid, ratings, summary, recommend, \
          body, date, reviewername, revieweremail) \
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [
          newReviewid,
          review.product_id,
          review.rating,
          review.summary,
          review.recommend,
          review.body,
          startTime,
          review.name,
          review.email
        ]
      }
      pool
        .query(insertReview)
        .then(() => {
          let inserttext = 'INSERT INTO characteristicsreviews (characteristicid, reviewid, value) VALUES'
          for (const [key, value] of Object.entries(review.characteristics)) {
            inserttext = inserttext + ` (${key}, ${newReviewid}, ${value} ),`
          }
          inserttext = inserttext.substring(0, inserttext.length - 1)
          if (review.photos.length > 0) {
            let phototext = '; INSERT INTO photos (reviewid, url) VALUES'
            review.photos.forEach(photo => {
              phototext = phototext + ` (${newReviewid}, '${photo}'),`
            })
            phototext = phototext.substring(0, phototext.length - 1)
            inserttext = inserttext + phototext
          }
          pool
            .query(inserttext)
            .then(() => {
              const endTime = new Date()
              const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
              console.log(`query time: ${elapsedTime} seconds`)
              cb(null, 'Created')
            })
            .catch(e => {
              console.error(e.stack)
              cb(e.stack, null)
             })
        })
        .catch(e => {
          console.error(e.stack)
          cb(e.stack, null)
        })
    })
    .catch(e => {
      console.error(e.stack)
      cb(e.stack, null)
    })
}

const upvoteHelpful = (producid, cb) => {

}

const report = (producid, cb) => {

}

module.exports.getReviews = getReviews
module.exports.getReviewsProdMeta = getReviewsProdMeta
module.exports.queryProductMeta = queryProductMeta
module.exports.getReviewsCharMeta = getReviewsCharMeta
module.exports.queryCharMeta = queryCharMeta
module.exports.postReview = postReview
module.exports.upvoteHelpful = upvoteHelpful
module.exports.report = report