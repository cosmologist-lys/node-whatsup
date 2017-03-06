var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SysUser = new Schema({
    uid: String,
    role:Number,
    name: String,
    password: String,
    createTime :{
        type: Date,
        default: Date.now()
    },
    lastLogTime :{
        type :Date,
        default :Date.now()
    }
});

exports.Demo = mongoose.model('SysUser', SysUser);