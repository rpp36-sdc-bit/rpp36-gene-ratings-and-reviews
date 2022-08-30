const pool = require('./config.js')
const fs = require('fs')
const path = require('path')
const pgQuery = require('./pgQueries.js')

const updateProductMeta = (productid, cb) => {
  process.stdout.write(`processing current product: ${productid}\r`)
  pgQuery.queryProductMeta(productid, (error, product) => {
    if (Object.keys(product).length > 0) {
      const prodUpdate = {
        text: 'UPDATE products SET (totalreviews, ratings1, ratings2, ratings3, \
          ratings4, ratings5, recommendfalse, recommendtrue) = ($2, $3, $4, $5, \
          $6, $7, $8, $9) WHERE id = $1',
        values: [
          product.id,
          product.totalreviews,
          product.ratings1,
          product.ratings2,
          product.ratings3,
          product.ratings4,
          product.ratings5,
          product.recommendfalse,
          product.recommendtrue
        ]
      }
      pool
        .query(prodUpdate)
        .then((res) => {
          cb()
        })
        .catch(e => console.error(e.stack))
    } else {
      cb()
    }
  })
}

const updateProductMetaAll = (finalid, currentid, startTime) => {
  if (currentid > finalid) {
    const endTime = new Date()
    const elapsedTime = ((endTime - startTime)/1000/60).toFixed(4)
    console.log(`$-----Product Metadata generation complete-----$`)
    console.log(`$-----Elapsed Time: ${elapsedTime} minutes-----$`)
  } else {
    updateProductMeta(currentid, () => {
      updateProductMetaAll(finalid, currentid + 1, startTime)
    })
  }
}

module.exports.updateProductMetaAll = updateProductMetaAll