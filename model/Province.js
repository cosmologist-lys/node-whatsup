var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Province = new Schema({
	no:Number,
	areaNo:Number,
	name:String
});

exports.Demo = mongoose.model('Province', Province);