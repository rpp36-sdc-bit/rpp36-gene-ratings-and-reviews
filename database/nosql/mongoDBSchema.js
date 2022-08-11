const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let PhotosSchema = mongoose.Schema({
  id: Number,
  url: String
});

let ReviewsSchema = mongoose.Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: [PhotosSchema]
});

let ProductReviewsSchema = mongoose.Schema({
  _id: Number,
  product: Number,
  reviews: [ReviewsSchema],
  ratings: {
    ratings1: Number,
    ratings2: Number,
    ratings3: Number,
    ratings4: Number,
    ratings5: Number
  },
  recommended: {
    false: Number,
    true: Number
  },
  characteristics: {
    Fit: {
      size: decimal,
      width: decimal,
      fit: decimal,
      length: decimal,
      comfort: decimal,
      quality: decimal
    }
  }
});

let ProductReviewsSchema = mongoose.model('ProductReviewsSchema', ProductReviewsSchema);

let readRatingsAndReviews = function (productid, cb) {
  ProductReviewsSchema.findOne({_id: productid}, (err, res) => {
    if (err) {
      cb(`error: ${err}`);
    } else {
      cb(res)
    }
  })
}

module.exports.readRatingsAndReviews = readRatingsAndReviews;