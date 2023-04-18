const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middleware");

const ExpressErrorHandler = require("../utils/ExpressErrorHandler");
const handleAsyncErrors = require("../utils/handleAsyncErrors");

const Lodge = require("../models/lodge");
const {lodgeJoiSchema} = require("../joiSchemas");

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

router.get("/", handleAsyncErrors(async (req, res) => {

    const lodgeList = await Lodge.find({});
    res.render("rentals/index", {lodgeList});
  }));
  
  router.post("/", validateRentals, isLoggedIn, handleAsyncErrors(async (req, res, next) => {
  
    const lodge = new Lodge(req.body.lodge);
    await lodge.save();
    req.flash("success", "Successfully Created A New Rental.");
    res.redirect(`/rentals/${lodge._id}`)
  }));
  
  router.get("/new", isLoggedIn, (req, res) => {
    res.render("rentals/new");
  });
  
  router.get("/:id", handleAsyncErrors(async (req, res) => {
    const lodge = await Lodge.findById(req.params.id).populate('reviews');
    if (!lodge) {
      req.flash("error", "Rental Not Found.");
      return res.redirect("/rentals");
  }
    res.render("rentals/show", {lodge});
  }));
  
  router.get("/:id/edit", isLoggedIn, handleAsyncErrors(async (req, res) => {
    const lodge = await Lodge.findById(req.params.id);
    res.render("rentals/edit", {lodge});
  }));
  
  router.put("/:id", validateRentals, isLoggedIn, handleAsyncErrors(async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndUpdate(id, req.body.lodge);
    req.flash("success", "Successfully Updated The Rental.");
    res.redirect(`/rentals/${id}`)
  }));

  router.delete("/:id", handleAsyncErrors(async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndDelete(id);
    res.redirect("/rentals");
  }));
  
module.exports = router;