const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/handleAsyncErrors');

const userController = require('../controllers/users');

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.registerUser));

router.route('/login')
    .get(userController.renderLoginForm)
    .post(userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router;