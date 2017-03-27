var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Province = new Schema({
	no:Number,
	name:String
});

exports.Demo = mongoose.model('Province', Province);