const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Lodget!');
            res.redirect('/rentals');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/rentals';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout(function(err) {
   if (err) { return next(err); }
   req.flash('success', "Logged Out Succesfully.");
   res.redirect('/rentals');
 });
};