const express = require("express");
const router = express.Router({mergeParams: true});
const reviewController = require("../controllers/reviews");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

const handleAsyncErrors = require("../utils/handleAsyncErrors");


router.post("/", isLoggedIn, validateReview, handleAsyncErrors(reviewController.createReview));
  
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, handleAsyncErrors(reviewController.deleteReview));
  
module.exports = router;