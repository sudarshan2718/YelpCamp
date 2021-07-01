const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviewControls = require('../controllers/reviews');



// add  review
router.post('/', isLoggedIn, validateReview, catchAsync(
    reviewControls.addReview
))

// delete  review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(
    reviewControls.deleteReview
))

module.exports = router;
