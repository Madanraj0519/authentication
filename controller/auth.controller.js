const UserModel = require('../model/User.model');

const authRouter = require('express').Router();


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
        const { email} = req.body;

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Invalid email id"
            })
        };

        const response = await UserModel.findOne({ email : email });
    
        if(response && response._id){
           return res.status(301).json({
            success : true,
            message : "password recovery email sent successfully"
           });
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


module.exports = authRouter;