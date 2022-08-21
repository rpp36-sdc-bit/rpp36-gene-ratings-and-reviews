const pgQuery = require('./pgQueries.js')

const reviews = (reqParams, cb) => {
  let sort = 'helpfulness'
  if (reqParams.sort === 'newest') {
    sort = 'newest'
  }
  pgQuery.getReviews(reqParams.product_id, sort, (err, data) => {
    if (err) {
      cb(err, null)
    } else {
      let reviewArr = []
      let reviewCount = 0
      let reviewCountObj = {}
      data.forEach((review) => {
        let reviewobj = {
            review_id: review.reviewsid,
            rating: review.ratings,
            summary: review.summary,
            recommend: review.recommend,
            response: review.response,
            body: review.body,
            date: review.date,
            reviewer_name: review.reviewername,
            helpfulness: review.helpfulness,
            photos: []
        }
        if (review.photosid === null) {
          reviewArr.push(reviewobj)
          reviewCountObj[review.reviewsid] = reviewCount
          reviewCount++
        } else {
          if (reviewCountObj[review.reviewsid]) {
            reviewArr[reviewCountObj[review.reviewsid]].photos.push({
              id: review.photosid,
              url: review.url
            })
          } else {
            reviewobj.photos.push({
              id: review.photosid,
              url: review.url
            })
            reviewArr.push(reviewobj)
            reviewCountObj[review.reviewsid] = reviewCount
            reviewCount++
          }
        }
      })
      cb(null, reviewArr)
    }
  })
}

const meta = () => {

}

const post = () => {

}

const upvote = () => {

}

module.exports.reviews = reviews
module.exports.meta = meta
module.exports.post = post
module.exports.upvote = upvote