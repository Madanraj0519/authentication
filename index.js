const express = require('express');
const bodyparser = require("body-parser");
const HTTP_SERVER = express();
const cors = require("cors");
const PORT = 5000;
const {connectDatabase} = require('./dbConfig');
const nodemailer = require('nodemailer');


// enabling CORS
HTTP_SERVER.use(cors());


connectDatabase();


HTTP_SERVER.use(bodyparser.json());

HTTP_SERVER.use(express.static(__dirname + "/public"));

HTTP_SERVER.listen(PORT, process.env.HOST_NAME,  () => {
    console.log(`Starting on port http://localhost:${PORT}`);
});



// It first go the index.js file and then hit the '/' go to the required './app' directory
HTTP_SERVER.use('/', require('./app'));