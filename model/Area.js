var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Area = new Schema({
	no:Number,
	name:String
});

exports.Demo = mongoose.model('Area', Area);