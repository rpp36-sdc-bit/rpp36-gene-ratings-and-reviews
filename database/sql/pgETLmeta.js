const pool = require('./config.js')
const fs = require('fs')
const path = require('path')

const queryProductMeta = (productid, cb) => {
  const prodLookUp = {
    text: 'SELECT ratings, recommend FROM reviews WHERE productid = $1',
    values: [productid]
  }
  pool
    .query(prodLookUp)
    .then((res) => {
      const data = res.rows;
      let reviewCount = data.length;
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
        cb(product)
      } else {
        cb(null)
      }
    })
    .catch(e => console.error(e.stack))
}

const updateProductMeta = (productid, cb) => {
  process.stdout.write(`processing current product: ${productid}\r`)
  queryProductMeta(productid, (product) => {
    if (product) {
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

const queryCharMeta = (productid, cb) => {
  const charMeta = {
    text: 'SELECT * FROM characteristics LEFT OUTER JOIN characteristicsreviews \
    on characteristics.id = characteristicsreviews.characteristicid WHERE productid = $1',
    values: [productid]
  }
  pool
    .query(charMeta)
    .then((res) => {
      const data = res.rows
      data.forEach(row => {
      })
    })
    .catch(e => console.error(e.stack))
}

module.exports.updateProductMetaAll = updateProductMetaAll