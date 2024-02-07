const getAllVenues = require('./routes/venue.route');

const WEB_SERVER = require('express').Router();

// inject the web pages
WEB_SERVER.get('/', (req, res) => {
    return res.render('pages/index', {
        pageTitle : "Home",
        pageName : "Home",
        pageDescription : "Welcome to home page",

    });
});

WEB_SERVER.get('/about', (req, res) => {
    return res.render('pages/index', {
        pageTitle : "About",
        pageName : "About",
        pageDescription : "Welcome to about page",

    });
});

WEB_SERVER.get('/venue', async(req, res) => {
    try{
        var venue = await getAllVenues();
        console.log(venue);
        return res.render('pages/venue', {
            pageTitle : "venue",
            pageName : "venue",
            pageDescription : "Welcome to venue page",
            venues : venue,
    
        });
    }catch(err){

    }
});


WEB_SERVER.get('/login', (req, res) => {
    return res.render('pages/login', {
        pageTitle : "login",
        pageName : "login",
        pageDescription : "Login to continue the page",

    });
});

WEB_SERVER.get('/signup', (req, res) => {
    return res.render('pages/signup', {
        pageTitle : "signup",
        pageName : "signup",
        pageDescription : "Create a account",

    });
});

module.exports = WEB_SERVER;