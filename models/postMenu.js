const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostMenuSchema = new Schema({
    
    menus: {
        type: String,
        required: true
    } 
    
});
module.exports = {PostMenu: mongoose.model('postMenu', PostMenuSchema )};