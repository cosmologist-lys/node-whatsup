var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var County = new Schema({
	no:Number,
	cityNo:Number,
	wid:String,
	name:String
});

exports.Demo = mongoose.model('County', County);
