const express = require("express");
const router = express.Router();
const {isLoggedIn, isAuthor, validateRentals} = require("../middleware");
const handleAsyncErrors = require("../utils/handleAsyncErrors");
const rentalController = require("../controllers/rentals");


router.route("/")
  .get(handleAsyncErrors(rentalController.renderIndex))
  .post(validateRentals, isLoggedIn, handleAsyncErrors(rentalController.createRental));

router.get("/new", isLoggedIn, rentalController.renderNewForm);
  
router.route("/:id")
  .get(handleAsyncErrors(rentalController.getRentalById))
  .put(validateRentals, isLoggedIn, isAuthor, handleAsyncErrors(rentalController.updateRental))
  .delete(isAuthor, handleAsyncErrors(rentalController.deleteRental));
  
router.get("/:id/edit", isLoggedIn, isAuthor, handleAsyncErrors(rentalController.renderEditForm));

module.exports = router;