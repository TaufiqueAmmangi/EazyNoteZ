const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    
    semester: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    professorName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    
    status: {
        type: String,
        default: 'public'
    },
    
    description: {
        type: String,
        required: true
    },
    
    creationDate: {
        type: Date,
        default: Date.now()
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    userPost: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    userProfile: {
        type: Schema.Types.ObjectId,
        ref: 'userProfile'
    },    
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    
    allowComments: {
        type: Boolean,
        default: false
    },
    
    file: {
        type: String,
        default: ''
    },
    imageF:{
        type: String,
        default: ''
    }
    
    
});
module.exports = {Post: mongoose.model('post', PostSchema )};