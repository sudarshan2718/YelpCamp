const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}
const renderNewCampForm = async (req, res, next) => {
    res.render('campgrounds/new');
}

const renderCamp = async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }else{
        res.render('campgrounds/show', { camp });
    }
}

const renderEditForm = async (req, res, next) => {
        
    const id = req.params.id;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
    
}

const createCamp = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({url: f.path,filename: f.filename}));
    camp.author = req.user._id;
    await camp.save();
    
    req.flash('success', 'Sucessfully made a new campground');
    res.redirect(`/campgrounds/${camp._id}`)
}

const editCamp = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const id = req.params.id;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(f => ({url: f.path,filename: f.filename}));
    camp.images.push(...imgs);
    camp.geometry = geoData.body.features[0].geometry;
    await camp.save();
    
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        
    }

    
    req.flash('success', 'Sucessfully updatedCampground');
    res.redirect(`/campgrounds/${camp._id}`)
}

const deleteCamp = async (req, res, next) => {
    const id = req.params.id;
    const camp = await Campground.findByIdAndDelete(id);
    for(let fn of camp.images){        
        await cloudinary.uploader.destroy(fn.filename);
    }
    req.flash('success', 'Successfully deletedCampground');
    res.redirect('/campgrounds');
}

module.exports = { 
    index,renderNewCampForm,renderCamp,
    renderEditForm,createCamp, editCamp,deleteCamp
};