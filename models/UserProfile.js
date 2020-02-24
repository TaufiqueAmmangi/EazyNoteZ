const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    
    lastName: {
        type: String,
        required: true
    },
    
    experience: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    }
    
    // imageF:{
    //     type: String,
    //     default: ''
    // },
    
    
    
    


});

module.exports = {UserProfile: mongoose.model('userprofile', UserProfileSchema )};