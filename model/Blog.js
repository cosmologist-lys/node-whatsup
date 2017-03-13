var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = new Schema({
    title:String,
    author:String,
    authorid:String,
    createTime :{
        type:Date,
        default:Date.now()
    },
    lastEditTime :{
        type:Date,
        default:Date.now()
    },
    content : String,
    words:Number
});

exports.Demo = mongoose.model('Blog', Blog);