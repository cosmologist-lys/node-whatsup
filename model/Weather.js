var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Weather = new Schema({
	queryDate :{
		type:Date,
		default:Date.now()
	} ,
	basic : {
		city:String,
		lat : String,
		lon : String,
		update : String
	},
	now : {
		txt : String,
		temp : String,
		wind :String
	},
	forcast : {//未来一天
		cond : String,
		date : String,
		temp_max : String,
		temp_min :String,
		wind_sc : String
	},
	suggestion : {
		air : String,
		conf : String,
		cw : String,
		drs : String,
		flu : String,
		sport : String,
		trav : String,
		uv : String
	}
});

exports.Demo = mongoose.model('Weather', Weather);