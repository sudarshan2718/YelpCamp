const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campControls = require('../controllers/campgrounds')
const {storage} = require('../cloudinary'); // auto lookup for index.js
const multer = require('multer');
const upload = multer({storage})

// get: list all campgrounds
// post: add new campground
router.route('/')
    .get(catchAsync(campControls.index))
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campControls.createCamp))
    

// new campground form
router.get('/new', isLoggedIn, catchAsync(campControls.renderNewCampForm))

// render edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(
    campControls.renderEditForm
))


// get: show Camp
// put: edit  campground
// delte: delete campground
router.route('/:id')
    .get(catchAsync(campControls.renderCamp))
    .put(isLoggedIn, isAuthor,upload.array('image'),validateCampground,catchAsync(campControls.editCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campControls.deleteCamp))


module.exports = router;
