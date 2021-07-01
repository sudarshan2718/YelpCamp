const Review = require('../models/review');
const Campground = require('../models/campground');

const addReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);        
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

const deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
}
module.exports = {addReview, deleteReview}
