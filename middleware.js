const ExpressError = require('./utils/ExpressError');
const schemas = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
function isLoggedIn(req,res,next) {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error','you must be signed in');
        res.redirect('/login');
    }else{
        next();
    }
}
function validateCampground(req, res, next) {
    const { error } = schemas.campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

async function isAuthor(req,res,next) {
    const id= req.params.id;
    
    try{
        const camp = await Campground.findById(id);
        if(!camp){
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        }else if(!camp.author.equals(req.user._id)){
            req.flash('error','You do not have permission to do that');
            res.redirect(`/campgrounds/${id}`);
        }else{
            next();
        }
    }catch(err){
        next(err);
    }
}

async function isReviewAuthor(req,res,next) {
    const {id,reviewId}= req.params;
    
    try{
        const review = await Review.findById(reviewId);
        if(!review){
            req.flash('error', 'review not found');
            res.redirect(`/campgrounds/${id}`);
        }else if(!review.author.equals(req.user._id)){
            req.flash('error','You do not have permission to do that');
            res.redirect(`/campgrounds/${id}`);
        }else{
            next();
        }
    }catch(err){
        next(err);
    }
}

function validateReview(req, res, next) {
    const { error } = schemas.reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports= {isLoggedIn, validateCampground, isAuthor,validateReview,isReviewAuthor}