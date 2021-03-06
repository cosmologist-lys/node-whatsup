const Province = require('../model/Province').Demo;
const City = require('../model/City').Demo;
const County = require('../model/County').Demo;
const Area = require('../model/Area').Demo;
const Weather = require('../model/Weather').Demo;
const tool = require('../tool/tool');

const weaTool = {
	packArea : function () {
		let areas = [];
		let areaWest = new Area({
			no : 1,
			name :'west'
		});
		areaWest.save(function (err, doc) {
			if (err) console.error(err);
		});
		let areaNorth = new Area({
			no : 2,
			name :'notrh'
		});
		areaNorth.save(function (err, doc) {
			if (err) console.error(err);
		});
		let areaEast = new Area({
			no : 3,
			name :'east'
		});
		areaEast.save(function (err, doc) {
			if (err) console.error(err);
		});
		let areaSouth = new Area({
			no : 4,
			name :'south'
		});
		areaSouth.save(function (err, doc) {
			if (err) console.error(err);
		});
		areas.push(areaWest);
		areas.push(areaSouth);
		areas.push(areaNorth);
		areas.push(areaEast);
		return areas;
	},
	JsonWeather : function (doc) {
		console.log(doc);
		let weatherInfo = JSON.parse(doc);
		let lat = weatherInfo.HeWeather5[0].basic.lat,
			lon = weatherInfo.HeWeather5[0].basic.lon,
			city = weatherInfo.HeWeather5[0].basic.city,
			update = weatherInfo.HeWeather5[0].basic.update.loc;
		let txt = weatherInfo.HeWeather5[0].now.cond.txt,
			tmp = weatherInfo.HeWeather5[0].now.tmp+"℃",
			wind =weatherInfo.HeWeather5[0].now.wind.dir+weatherInfo.HeWeather5[0].now.wind.sc;
		let cond =weatherInfo.HeWeather5[0].daily_forecast[1].cond.txt_n+"|"+weatherInfo.HeWeather5[0].daily_forecast[1].cond.txt_d,
			date =weatherInfo.HeWeather5[0].daily_forecast[1].date,
			tmpmax =weatherInfo.HeWeather5[0].daily_forecast[1].tmp.max,
			tmpmin = weatherInfo.HeWeather5[0].daily_forecast[1].tmp.min,
			windsc =weatherInfo.HeWeather5[0].daily_forecast[1].wind.sc;
		let air =weatherInfo.HeWeather5[0].suggestion.air.brf+"|"+weatherInfo.HeWeather5[0].suggestion.air.txt,
			conf = weatherInfo.HeWeather5[0].suggestion.comf.brf+"|"+weatherInfo.HeWeather5[0].suggestion.comf.txt,
			cw = weatherInfo.HeWeather5[0].suggestion.cw.brf+"|"+weatherInfo.HeWeather5[0].suggestion.cw.txt,
			drs = weatherInfo.HeWeather5[0].suggestion.drsg.brf+"|"+weatherInfo.HeWeather5[0].suggestion.drsg.txt,
			flu = weatherInfo.HeWeather5[0].suggestion.flu.brf+"|"+weatherInfo.HeWeather5[0].suggestion.flu.txt,
			sport = weatherInfo.HeWeather5[0].suggestion.sport.brf+"|"+weatherInfo.HeWeather5[0].suggestion.sport.txt,
			travel = weatherInfo.HeWeather5[0].suggestion.trav.brf+"|"+weatherInfo.HeWeather5[0].suggestion.trav.txt,
			uv = weatherInfo.HeWeather5[0].suggestion.uv.brf+"|"+weatherInfo.HeWeather5[0].suggestion.uv.txt;

		let weather = new Weather({
			basic : {
				city:city,
				lat : lat,
				lon : lon,
				update : update
			},
			now : {
				txt : txt,
				temp : tmp,
				wind : wind
			},
			forcast : {
				cond : cond,
				date : date,
				temp_max : tmpmax,
				temp_min :tmpmin,
				wind_sc : windsc
			},
			suggestion : {
				air : air,
				conf : conf,
				cw : cw,
				drs : drs,
				flu : flu,
				sport : sport,
				trav : travel,
				uv : uv
			}
		});
		//console.log(JSON.stringify(weather));
		return weather;
	},
	loadPic : function (txt) {
		let picPath = "http://localhost:3000/wtimgs/";
		let pic= '';
		if (tool.isContains(txt,'晴')) pic = 'sunny.png';
		if (tool.isContains(txt,'雨')) pic = 'rainny.png';
		if (tool.isContains(txt,'雪')) pic = 'snowy.png';
		if (tool.isContains(txt,'雷')) pic = 'thunder.png';
		if (tool.isContains(txt,'云')) pic = 'cloudy.png';
		if (tool.isContains(txt,'阴')) pic = 'cloudy.png';
		if (tool.isContains(txt,'晴，云')) pic = 'sunnyCloudy.png';
		return picPath + pic;
	}
};

module.exports = weaTool;