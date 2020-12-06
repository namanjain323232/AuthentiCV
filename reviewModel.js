const fs = require("fs");
const mongoose = require("mongoose");
const validator = require("validator");
// const random = require("../../utils/utils");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review is Required"],
      trim: true
    },
    reviewId: {
      type: String
    },
    sId: {
      type: String
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;


