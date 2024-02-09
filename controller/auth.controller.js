"use strict";
const nodemailer = require("nodemailer");
var crypto = require("crypto");
require('dotenv').config();

const UserModel = require('../model/User.model');
const authRouter = require('express').Router();
// const {sendTestEmail} = require('../mailer');

// sign-up
authRouter.post('/create', async(req, res) => {

   try{
    const user = new UserModel(req.body);
    const response = await user.save();

    if(response._id){
        return res.status(201).json({
            success : true,
            message : "Your account has been created successfully"
        });
    }else{
        return res.status(500).json({
            success : false,
            message : "Something went wrong"
        })
    }
   }catch(err){
    return res.status(400).json({
        success : false,
        error : err.message
    })
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
authRouter.post('/forgotPassword', async(req, res) => {
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


            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                  user: "madanraj0519@gmail.com",
                  pass: "ljyahzufitgnsrgl",
                },
              })

              async function main() {
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: '"Fred Foo 👻" <madanraj0519@gmail.com>', // sender address
                  to: "madanswetha10@gmail.com", // list of receivers
                  subject: "Hello ✔", // Subject line
                  text: "Hello world?", // plain text body
                  html: "<b>Hello world?</b>", // html body
                });
              
                console.log("Message sent: %s", info.messageId);
              }
              
              main().catch(console.error);
           
            
            return res.status(301).json({
            success : true,
            message : "password recovery email sent successfully",
            uid : response._id,
            str : response.string,
            },);
           
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

authRouter.put("/update/:uid", (req, res) => {

    // const UserData = req.body;
    const { uid } = req.params;
  
    UserModel.findByIdAndUpdate(uid, { $unset: { string : 1 } })
      .then((response) => {
        if (response && response._id) {  
            return res.status(200).json({
            success: true,
            message: "User Updated Successfully",
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