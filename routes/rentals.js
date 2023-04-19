const express = require("express");
const router = express.Router();
const {isLoggedIn, isAuthor, validateRentals} = require("../middleware");
const handleAsyncErrors = require("../utils/handleAsyncErrors");
const rentalController = require("../controllers/rentals");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route("/")
  .get(handleAsyncErrors(rentalController.renderIndex))
  .post(isLoggedIn, upload.array('image'), validateRentals, handleAsyncErrors(rentalController.createRental));

router.get("/new", isLoggedIn, rentalController.renderNewForm);
  
router.route("/:id")
  .get(handleAsyncErrors(rentalController.getRentalById))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateRentals, handleAsyncErrors(rentalController.updateRental))
  .delete(isAuthor, handleAsyncErrors(rentalController.deleteRental));
  
router.get("/:id/edit", isLoggedIn, isAuthor, handleAsyncErrors(rentalController.renderEditForm));

module.exports = router;