var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var County = new Schema({
	no:Number,
	cityNo:Number,
	name:String
});

exports.Demo = mongoose.model('County', County);
