const Lodge = require("../models/lodge");
const { cloudinary } = require("../cloudinary");

module.exports.renderIndex = async (req, res) => {

    const lodgeList = await Lodge.find({});
    res.render("rentals/index", {lodgeList});
  };
  
module.exports.createRental = async (req, res, next) => {
  
    const lodge = new Lodge(req.body.lodge);
    lodge.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
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
    const lodge = await Lodge.findByIdAndUpdate(id, req.body.lodge);
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    lodge.images.push(...images);
    await lodge.save();
    
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
      }
      await lodge.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  
    req.flash("success", "Successfully Updated The Rental.");
    res.redirect(`/rentals/${id}`)
  };

module.exports.deleteRental = async(req, res) => {
    const {id} = req.params;
    await Lodge.findByIdAndDelete(id);
    res.redirect("/rentals");
  };