const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

function sendEmail(receiverEmail, url){
    nodemailer.createTestAccount((err, account) => {
        var transporter = nodemailer.createTransport(smtpTransport({
           service:"Gmail",
            auth: {
                user: process.env.EMAIL_NAME,       // Sender mail id
                pass: process.env.EMAIL_PASSWORD                 // Sender password
            }
            }));
        let mailOptions = {
            from: `Fred Foo 👻" <${process.env.EMAIL_NAME}>`,        // Sender mail id
            to: 'madanswetha10@gmail.com',                // Reciever mail id (For multiple recievers to:'abc@gmail.com,xyz@gmail.com')
            subject: 'Password recovery mail',
            text: `To update the password! click on link ${url}` 
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error', error);
            }
            else{
                console.log('Success', info);
            }
        });
    });
  }

module.exports = sendEmail;