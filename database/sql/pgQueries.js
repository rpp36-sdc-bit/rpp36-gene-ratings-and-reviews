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
      return (e.stack, null)
    })
}

const getReviewsProdMeta = (productid) => {
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
      console.log(data)
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      return data
    })
    .catch(e => console.error(e.stack))
}

const getReviewsCharMeta = (productid) => {
  const startTime = new Date()
  const charMeta = {
    text: 'SELECT id, name, rating FROM characteristics WHERE productid = $1',
    values: [productid]
  }
  pool
    .query(charMeta)
    .then((res) => {
      const data = res.rows
      console.log(data)
      const endTime = new Date()
      const elapsedTime = ((endTime - startTime)/1000).toFixed(4)
      console.log(`query time: ${elapsedTime} seconds`)
      return data
    })
    .catch(e => console.error(e.stack))
}

const postReview = (review, cb) => {

}

const upvoteHelpful = (producid, cb) => {

}

const report = (producid, cb) => {

}

module.exports.getReviews = getReviews
module.exports.getReviewsProdMeta = getReviewsProdMeta
module.exports.getReviewsCharMeta = getReviewsCharMeta
module.exports.postReview = postReview
module.exports.upvoteHelpful = upvoteHelpful
module.exports.report = report