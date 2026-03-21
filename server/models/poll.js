const mongoose = require("mongoose");

const optionschema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
        trim:true
    },
    votes:{
        type:Number,
        default:0
    }
});

const pollschema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
        trim:true
    },
    options:{
        type:[optionschema],
        validate:{
            validator:function(value){
                return value.length>=2 && value.length<=4;
            },
            message:"poll must have 2 to 4 options"
        }
    },
    expiresAt:{
        type:Date,
        required:true,
    }
});

module.exports = mongoose.model("Poll",pollschema);