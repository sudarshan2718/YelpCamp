const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require('./cities');
const { places, descriptors } = require("./seedHelpers");
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// ObjectId("60da7f412ac9f54f002beff6")
const seedDB = async () => {
    await Campground.deleteMany({})

    for (let i = 0; i < 50; ++i) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "60da6fd8fd82224cc4b8d392",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand].city},${cities[rand].state}`,
            images: [
                {    
                    url: 'https://res.cloudinary.com/dm3trehqj/image/upload/v1624963452/YelpCamp/ubbxdhik0oh6pe0mpmat.jpg',
                    filename: 'YelpCamp/ubbxdhik0oh6pe0mpmat'
                },
                {
                    url: 'https://res.cloudinary.com/dm3trehqj/image/upload/v1624963459/YelpCamp/kypplhg2mlvjtbruzggc.jpg',
                    filename: 'YelpCamp/kypplhg2mlvjtbruzggc'
                },
                {
                    url: 'https://res.cloudinary.com/dm3trehqj/image/upload/v1624963466/YelpCamp/bwoidlzdimxkojmtttd6.jpg',
                    filename: 'YelpCamp/bwoidlzdimxkojmtttd6'
                }
            ],
            geometry: { type: 'Point', coordinates: [ 77.4893, 10.2393 ] },
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum, ad?",
            price: price
        })
        await camp.save();

    }

}


seedDB().then(() => {
    console.log("DATA SAVED");
    db.close(() => { console.log("CLOSED") });
}).catch((err) => {
    console.log(err.message, "DATA FAILED TO SAVE");
    db.close(() => { console.log("CLOSED") });
});

