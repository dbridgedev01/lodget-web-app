const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/handleAsyncErrors');

const userController = require('../controllers/users');

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.registerUser));

router.route('/login')
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router;