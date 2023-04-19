const ExpressErrorHandler = require("./utils/ExpressErrorHandler");
const {lodgeJoiSchema, reviewJoiSchema} = require("./joiSchemas");
const Lodge = require("./models/lodge");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You Must Be Logged In To Continue.");
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    if (!lodge.author.equals(req.user._id)) {
        req.flash('error', 'Error, Insufficient Permissions.');
        return res.redirect(`/rentals/${id}`);
    }
    next();
};

module.exports.validateRentals = (req, res, next) => {

    const {error} = lodgeJoiSchema.validate(req.body);
  
    if(error) {
      const message = error.details.map(er => er.message).join(", ");
      throw new ExpressErrorHandler(400, message);
    }
   else {
    next();
   }
  };

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Error, Insufficient Permissions.');
        return res.redirect(`/rentals/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const message = error.details.map(er => er.message).join(',')
        throw new ExpressErrorHandler(400, message)
    } else {
        next();
    }
  };