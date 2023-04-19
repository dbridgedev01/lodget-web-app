const Lodge = require("../models/lodge");

module.exports.renderIndex = async (req, res) => {

    const lodgeList = await Lodge.find({});
    res.render("rentals/index", {lodgeList});
  };
  
module.exports.createRental = async (req, res, next) => {
  
    const lodge = new Lodge(req.body.lodge);
    lodge.author = req.user._id;
    await lodge.save();
    req.flash("success", "Successfully Created A New Rental.");
    res.redirect(`/rentals/${lodge._id}`)
  };

module.exports.renderNewForm = (req, res) => {
    res.render("rentals/new");
  };

module.exports.getRentalById = async (req, res) => {
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
  };

  module.exports.renderEditForm = async (req, res) => {
    const lodge = await Lodge.findById(req.params.id);
    res.render("rentals/edit", {lodge});
  };

module.exports.updateRental = async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndUpdate(id, req.body.lodge);
    req.flash("success", "Successfully Updated The Rental.");
    res.redirect(`/rentals/${id}`)
  };

module.exports.deleteRental = async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndDelete(id);
    res.redirect("/rentals");
  };