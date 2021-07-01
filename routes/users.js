const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const userControls = require('../controllers/users');

// get: render register form
// post: register user

router.route('/register')
    .get(userControls.renderRegisterForm)
    .post(catchAsync(userControls.registerUser))



// get: render login form
// post: login user
router.route('/login')
    .get(userControls.renderLoginForm)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),userControls.login)


// Logout route
router.get('/logout', userControls.logout)

module.exports = router;


