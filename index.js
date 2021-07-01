if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRouter = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const mydb = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const {scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls} = require('./CSP');
const MongoDBStore = require("connect-mongo");
mongoose.connect(mydb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));


// for partials
app.engine('ejs', ejsMate);

const secret = process.env.SECRET || 'thisissecret';
const store = MongoDBStore.create({
    mongoUrl: mydb,
    touchAfter: 24*60*60,
    secret,
})

store.on("error",function(err) {
    console.log("SESSION STORE ERROR: " + err.message);
})
// session ---------------------------------------
app.use(session(
    {
        name: 'session',
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            //secure: true, // for https connection
            expires: Date.now() + (1000*60*60*24*7),
            maxAge: 1000*60*60*24*7
        },
        store
    }
));

// --------------------------------------------------------
app.use(flash());
app.use(mongoSanitize({
    replaceWith: '_'
}));

// content security policy middleware
// ---------------------------------------------------------------------------------
app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// ------------------------------------------------------------------------------------




// passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// passpor use Local Strategy's authenticate method, which belongs to User
passport.use(new LocalStrategy(User.authenticate()))

// how to store and unstore  user in session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// adding flash messages to locals
app.use((req, res,next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    
    next()
})

// routes
app.use("/",userRouter)
app.use("/campgrounds",campgroundRouter)
app.use("/campgrounds/:id/reviews",reviewRouter)

app.get('/', (req, res) => {
    res.render('home');
});

// this only runs if request route is not defined
app.all('*', (req, res, next) => {
    next(new ExpressError("PAGE NOT FOUND", 404))
});



app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) {
        err.message = "Oh No, Something Went Wrong";
    }
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
});


