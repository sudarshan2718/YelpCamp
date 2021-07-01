const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200')
});
// to include vrituals in result object
const opts = {toJSON: {virtuals: true}};
const CampgroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
            type: String, enum: ['Point'], required: true
        },
        coordinates: {
            type: [Number], required: true
        }
    },
    images: [
        ImageSchema
    ],
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>
    `
})
CampgroundSchema.post('findOneAndDelete',async function(camp){
    if(camp){
        await Review.deleteMany({
            _id: { $in: camp.reviews}
        });

        
    }
})
module.exports = model('Campground',CampgroundSchema);
