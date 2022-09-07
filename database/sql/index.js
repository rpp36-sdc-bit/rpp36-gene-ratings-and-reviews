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
        if (reviewCountObj[review.reviewsid] === undefined) {
          let date = new Date(parseInt(review.date))
          date = date.toJSON()
          let reviewobj = {
            review_id: review.reviewsid,
            rating: review.ratings,
            summary: review.summary,
            recommend: review.recommend,
            response: review.response === "null" || review.response === null ? null : review.response,
            body: review.body,
            date: date,
            reviewer_name: review.reviewername,
            helpfulness: review.helpfulness,
            photos: []
          }
          if (review.photosid) {
            reviewobj.photos.push({
              id: review.photosid,
              url: review.url
            })
          }
          reviewArr.push(reviewobj)
          reviewCountObj[review.reviewsid] = reviewCount
          reviewCount++
        } else {
          reviewArr[reviewCountObj[review.reviewsid]].photos.push({
            id: review.photosid,
            url: review.url
          })
        }
      })
      let page = reqParams.page ? parseInt(reqParams.page) : 1
      let count = reqParams.count ? parseInt(reqParams.count) : 5
      let resArr = []
      let start = page === 1 ? 0 : (page - 1) * count
      let end = start + count
      for (var i = start; i < end; i++) {
        if (reviewArr[i]) {
          resArr.push(reviewArr[i])
        }
      }
      let res = {
        product: reqParams.product_id,
        page: page,
        count: count,
        results: resArr
      }
      cb(null, res)
    }
  })
}

const meta = (reqParams, cb) => {
  let reviewProdMeta = new Promise((resolve, reject) => {
    pgQuery.getReviewsProdMeta(reqParams.product_id, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data[0])
      }
    })
  })
  let reviewCharMeta = new Promise((resolve, reject) => {
    pgQuery.getReviewsCharMeta(reqParams.product_id, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
  Promise.all([reviewProdMeta, reviewCharMeta]).then((results) => {
    let res = {
      product_id: reqParams.product_id,
      ratings: {
        1: results[0].ratings1,
        2: results[0].ratings2,
        3: results[0].ratings3,
        4: results[0].ratings4,
        5: results[0].ratings5
      },
      recommended: {
        false: results[0].recommendfalse,
        true: results[0].recommendtrue
      },
      characteristics: {}
    }
    results[1].forEach(char => {
      res.characteristics[char.name] = {
        id: char.id,
        value: char.rating
      }
    })
    cb(null, res)
  }).catch(err => {
    cb(err, null)
  })
}

const metaAlt = (reqParams, cb) => {
  let reviewProdMeta = new Promise((resolve, reject) => {
    pgQuery.queryProductMeta(reqParams.product_id, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
  let reviewCharMeta = new Promise((resolve, reject) => {
    pgQuery.queryCharMeta(reqParams.product_id, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
  Promise.all([reviewProdMeta, reviewCharMeta]).then((results) => {
    let res = {
      product_id: reqParams.product_id,
      ratings: {
        1: results[0].ratings1,
        2: results[0].ratings2,
        3: results[0].ratings3,
        4: results[0].ratings4,
        5: results[0].ratings5
      },
      recommended: {
        false: results[0].recommendfalse,
        true: results[0].recommendtrue
      },
      characteristics: {}
    }
    for (const [key, value] of Object.entries(results[1])) {
      res.characteristics[key] = value
    }
    cb(null, res)
  }).catch(err => {
    cb(err, null)
  })
}

const post = (review, cb) => {
  pgQuery.postReview(review, (err, data) => {
    if (err) {
      cb(err, null)
    } else {
      cb(null, data)
    }
  })
}

const upvote = () => {

}

const report = () => {

}

module.exports.reviews = reviews
module.exports.meta = meta
module.exports.metaAlt = metaAlt
module.exports.post = post
module.exports.upvote = upvote
module.exports.report = report