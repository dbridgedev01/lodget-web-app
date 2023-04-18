const express = require("express");
const router = express.Router();
const {isLoggedIn, isAuthor, validateRentals} = require("../middleware");
const handleAsyncErrors = require("../utils/handleAsyncErrors");
const Lodge = require("../models/lodge");



router.get("/", handleAsyncErrors(async (req, res) => {

    const lodgeList = await Lodge.find({});
    res.render("rentals/index", {lodgeList});
  }));
  
  router.post("/", validateRentals, isLoggedIn, handleAsyncErrors(async (req, res, next) => {
  
    const lodge = new Lodge(req.body.lodge);
    lodge.author = req.user._id;
    await lodge.save();
    req.flash("success", "Successfully Created A New Rental.");
    res.redirect(`/rentals/${lodge._id}`)
  }));
  
  router.get("/new", isLoggedIn, (req, res) => {
    res.render("rentals/new");
  });
  
  router.get("/:id", handleAsyncErrors(async (req, res) => {
    const lodge = await Lodge.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
  }).populate('author');
    if (!lodge) {
      req.flash("error", "Rental Not Found.");
      return res.redirect("/rentals");
  }
    res.render("rentals/show", {lodge});
  }));
  
  router.get("/:id/edit", isLoggedIn, isAuthor, handleAsyncErrors(async (req, res) => {
    const lodge = await Lodge.findById(req.params.id);
    res.render("rentals/edit", {lodge});
  }));
  
  router.put("/:id", validateRentals, isLoggedIn, isAuthor, handleAsyncErrors(async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndUpdate(id, req.body.lodge);
    req.flash("success", "Successfully Updated The Rental.");
    res.redirect(`/rentals/${id}`)
  }));

  router.delete("/:id", isAuthor, handleAsyncErrors(async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndDelete(id);
    res.redirect("/rentals");
  }));
  
module.exports = router;