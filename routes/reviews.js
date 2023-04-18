const express = require("express");
const router = express.Router({mergeParams: true});

const Lodge = require("../models/lodge");
const Review = require('../models/review');

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

const handleAsyncErrors = require("../utils/handleAsyncErrors");


router.post("/", isLoggedIn, validateReview, handleAsyncErrors(async (req, res) => {
    const lodge = await Lodge.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    lodge.reviews.push(review);
    await review.save();
    await lodge.save();
    req.flash("success", "Successfully Created A New Review.");
    res.redirect(`/rentals/${lodge._id}`);
  }));
  
  router.delete("/:reviewId", isLoggedIn, isReviewAuthor, handleAsyncErrors(async (req, res) => {
    const { id, reviewId } = req.params;
    await Lodge.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rentals/${id}`);
  }));
  
module.exports = router;