const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let PhotoSchema = mongoose.Schema({
  _id: Number,
  url: String
});

let ReviewSchema = mongoose.Schema({
  _id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
  photos: [PhotosSchema]
});

let ProductSchema = mongoose.Schema({
  _id: Number,
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

let Product = mongoose.model('Product', ProductSchema, 'reviews');
let Review = mongoose.model('Review', ReviewSchema, 'reviews');
let Photo = mongoose.model('Photo', PhotoSchema, 'reviews');

let readReview = function (productid, cb) {
  Product.findOne({_id: productid}, (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res)
    }
  })
}

let createProduct = function (productid, cb) {

}

let writeReview = function (productid, review, cb) {
  Product.findOne({_id: productid}, (err, res) => {
    if (err) {
      cb(err, null);
    } else {
    }
  })
}

module.exports.readRatingsAndReviews = readRatingsAndReviews;