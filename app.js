const express = require('express');
const APP_SERVER = express();


// set the view engine to the ejs
APP_SERVER.set('view engine', 'ejs');


// inject the web server;
APP_SERVER.use('/', require('./webserver'));

// Inject the API controller
APP_SERVER.use("/api/customers", require('./controller/Customer.controller'));
APP_SERVER.use("/api/booking", require('./controller/Booking.controller'));
APP_SERVER.use("/api/venues", require('./controller/Venue.controller'));

APP_SERVER.use("/api/auth", require('./controller/auth.controller'));

module.exports = APP_SERVER