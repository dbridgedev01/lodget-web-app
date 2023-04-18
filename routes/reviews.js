const express = require("express");
const router = express.Router({mergeParams: true});

const Lodge = require("../models/lodge");
const Review = require('../models/review');
const {reviewJoiSchema} = require("../joiSchemas");

const handleAsyncErrors = require("../utils/handleAsyncErrors");
const ExpressErrorHandler = require("../utils/ExpressErrorHandler");


const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const message = error.details.map(er => er.message).join(',')
        throw new ExpressErrorHandler(400, message)
    } else {
        next();
    }
  }

router.post("/", validateReview, handleAsyncErrors(async (req, res) => {
    const lodge = await Lodge.findById(req.params.id);
    const review = new Review(req.body.review);
    lodge.reviews.push(review);
    await review.save();
    await lodge.save();
    req.flash("success", "Successfully Created A New Review.");
    res.redirect(`/rentals/${lodge._id}`);
  }));
  
  router.delete("/:reviewId", handleAsyncErrors(async (req, res) => {
    const { id, reviewId } = req.params;
    await Lodge.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rentals/${id}`);
  }));
  
module.exports = router;