const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type : String,
        required : true
    },
    aboutMe : {
        type : String,
        default : ''
    },
    isUploaded : {
        type : Boolean,
        required : true
    }
}, {timestamps: true}); 

module.exports = mongoose.model('User',userSchema);
