var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var City = new Schema({
	no:Number,
	provinceNo:Number,
	name:String
});

exports.Demo = mongoose.model('City', City);