// "use strict";
const nodemailer = require("nodemailer");
var crypto = require("crypto");
require('dotenv').config();
const cors = require("cors");
const sendEmail = require('../service');


const UserModel = require('../model/User.model');
const authRouter = require('express').Router();

// sign-up
authRouter.post('/create', async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Basic request validation
        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        // Check if user already exists with the provided email
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }
        
        // Create a new user
        const newUser = new UserModel({ name, email, phoneNumber, password });
        const savedUser = await newUser.save();

        res.status(201).json({ success: true, message: 'Your account has been created successfully', user: savedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});



// sing-in
authRouter.post('/login', async(req, res) => {

    try{
        const { email, password } = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Invalid email id"
            })
        };

        if(!password){
            return res.status(400).json({
                success : false,
                message : "Invalid password"
            }) 
        };

        const response = await UserModel.findOne({ email : email });
    
        if(response && response._id){
            if(response.password === password){
                return res.status(201).json({
                    success : true,
                    message : "sign in successful"
                });
            }else{
                return res.status(400).json({
                    success : false,
                    message : "Email or password is wrong"
                });
            }
        }else{
            return res.status(401).json({
                success : false,
                message : "Account not found!"
            })
        }
       }catch(err){
        return res.status(400).json({
            success : false,
            error : err.message
        })
    }
});

// forgot password
authRouter.post('/forgotPassword', cors(), async(req, res) => {
    try{
        // generating random string,

        var randomString = crypto.randomBytes(16).toString('hex');

        const { email} = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Invalid email id"
            })
        };

        const response = await UserModel.findOne({ email : email });
    
        if(response && response._id){

            response.string = randomString;
            await response.save();

            // for sending the email to the user
            const url = `http://localhost:5173/updatePassword?uid=${response._id}&str=${response.string}`;

            sendEmail(response.email, url);
              
            return res.status(200).json({
            success : true,
            message : "password recovery email sent successfully",
            uid : response._id,
            str : response.string,
            },);
           
        }else{
            return res.status(401).json({
                success : false,
                message : "Account not found! Create a new account"
            })
        }
       }catch(err){
        return res.status(400).json({
            success : false,
            error : err.message
        })
    }
});

authRouter.put("/update/:uid", (req, res) => {

    const UserData = req.body;
    const { uid,} = req.params;
  
    UserModel.findByIdAndUpdate(uid, 
        UserData, 
        { $unset: { string : 1 }}
        )
      .then((response) => {
        if (response && response._id) {  
            return res.status(200).json({
            success: true,
            message: "User Password Updated Successfully",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "User does not exist",
          });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          error: error,
        });
      });
  });



module.exports = authRouter;