const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
require("dotenv").config();
const Lodge = require("./models/lodge");
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require("./models/lodge");
const ejsMate = require("ejs-mate");
const handleAsyncErrors = require("./utils/handleAsyncErrors");
const ExpressErrorHandler = require("./utils/ExpressErrorHandler");
const joi = require("joi");
const app = express();
const {lodgeJoiSchema, reviewJoiSchema} = require("./joiSchemas");
const Review = require('./models/review');

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const validateRentals = (req, res, next) => {

  const {error} = lodgeJoiSchema.validate(req.body);

  if(error) {
    const message = error.details.map(er => er.message).join(", ");
    throw new ExpressErrorHandler(400, message);
  }
 else {
  next();
 }
}

const validateReview = (req, res, next) => {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
      const message = error.details.map(er => er.message).join(',')
      throw new ExpressErrorHandler(400, message)
  } else {
      next();
  }
}

app.get("/", (req, res) => {
  res.render("home");
});

// Database Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To Database.");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/rentals", handleAsyncErrors(async (req, res) => {

  const lodgeList = await Lodge.find({});
  res.render("rentals/index", {lodgeList});
}));

app.post("/rentals", validateRentals, handleAsyncErrors(async (req, res, next) => {

  const lodge = new Lodge(req.body.lodge);
  await lodge.save();
  res.redirect(`/rentals/${lodge._id}`)
}));

app.get("/rentals/new", (req, res) => {
  res.render("rentals/new");
});

app.get("/rentals/:id", handleAsyncErrors(async (req, res) => {
  const lodge = await Lodge.findById(req.params.id).populate('reviews');
  res.render("rentals/show", {lodge});
}));

app.get("/rentals/:id/edit", handleAsyncErrors(async (req, res) => {
  const lodge = await Lodge.findById(req.params.id);
  res.render("rentals/edit", {lodge});
}));

app.put("/rentals/:id", validateRentals, handleAsyncErrors(async(req, res) => {
  const {id} = req.params;
  await Lodge.findByIdAndUpdate(id, req.body.lodge);
  res.redirect(`/rentals/${id}`)
}));

app.post('/rentals/:id/reviews', validateReview, handleAsyncErrors(async (req, res) => {
  const lodge = await Lodge.findById(req.params.id);
  const review = new Review(req.body.review);
  lodge.reviews.push(review);
  await review.save();
  await lodge.save();
  res.redirect(`/rentals/${lodge._id}`);
}));

app.delete("/rentals/:id", handleAsyncErrors(async(req, res) => {
  const {id} = req.params;
  await Lodge.findByIdAndDelete(id);
  res.redirect("/rentals");
}));

app.delete('/rentals/:id/reviews/:reviewId', handleAsyncErrors(async (req, res) => {
  const { id, reviewId } = req.params;
  await Lodge.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/rentals/${id}`);
}));

app.all("*", (req, res, next) => {
  next(new ExpressErrorHandler(404, "Page Not Found."));
})

app.use((err, req, res, next) => {
  const {statusCode=500} = err;
  if(!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", {err})
})

// Server
app.listen(3000, () => {
  console.log("Server Started, Listening on Port 3000.");
});