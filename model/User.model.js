const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    phoneNumber : {
        type : String,
        required : true,
    },
    state : {                 
        type : String,
       
    },
    city : {
        type : String,
        
    },
    string : {
        type : String,
    }

});


module.exports = mongoose.model('User', userSchema);