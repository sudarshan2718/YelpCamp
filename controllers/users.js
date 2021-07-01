const User = require('../models/user');

const renderRegisterForm = (req, res) => {
    res.render('users/register');
}

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        // this function requires callback
        req.login(regUser, err => {
            if (err) {
                next(err);
            } else {
                req.flash('success', 'Welcome to Yelp Camp');
                res.redirect('/campgrounds');
            }
        });

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

const renderLoginForm = (req, res) => {
    res.render('users/login')
}

const logout = (req, res) => {
    req.logout();
    req.flash('success', 'sucessfully logged out');
    res.redirect('/campgrounds');
}

const login = (req, res) => {
    req.flash('success', 'Welcome back');
    // returning back to where login was pressed
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports = {
    renderRegisterForm, registerUser,
    renderLoginForm, logout, login
}