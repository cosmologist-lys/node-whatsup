var express = require('express');
var router = express.Router();
var Province = require('../model/Province').Demo;
var City = require('../model/City').Demo;
var County = require('../model/County').Demo;
var Area = require('../model/Area').Demo;
var tool = require('../tool/tool');
var reqUtils = require('../tool/reqUtils');
var wt = require('../tool/weatherTool');
var request = require('request');
var kfg = require('../kfg');
var Weather = require('../model/Weather').Demo;


router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});


router.get('/index',function (req, res) {
	var user = req.session.user;
	var time = new Date().toLocaleDateString();
	var flg = 'weather';
	var areas = [];
	var pros = req.session.provinces;
	var cities = req.session.cities;
	var counties = req.session.counties;
	var weather = req.session.weather;
	var png = '' ,sg = '';
	if (weather != undefined){
		png = wt.loadPic(weather.now.txt);
		sg = weather.suggestion.conf;
	}
	var weatherList = [];
	Area.find(function (err, docs) {
		if (tool.isNotNull(docs)) areas = docs;
		Weather.find().sort({_id:-1}).limit(5).exec(function (err, weas) {//分页查询，限制查询 id:1升序 id:-1降序
			if (err) console.error(err);
			for (var num in weas){
				weatherList.push(weas[num]);
				if (weather == undefined || weather == ''){
					weather = weas[0];
					png = wt.loadPic(weather.now.txt);
					sg = weather.suggestion.conf;
				}
			}
			res.render('weather/weatherlist',
				{user:user,flg:flg,time:time,welist:weatherList,
					sg:sg,areas:areas,pros:pros,cities:cities,
					counties:counties,weather:weather,png:png});
			})
		});
});

router.post('/index',function (req, res) {

});

router.get('/queryProvince',function (req, res) {
	var areaNo = req.query.no;
	Province.find({areaNo : areaNo},function (err, docs) {
		if (!err) req.session.provinces = docs;
		else  console.error(err);
		res.redirect('/wea/index');
	})
});

router.get('/queryCity',function (req, res) {
	var proNo = req.query.no;
	var cityurl = kfg.prurl+"/"+proNo;
	req.session.queryurl = cityurl;
	var cityBox = [];
	request(cityurl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var cities = JSON.parse(body);
			for(var i=0;i<cities.length;i++){
				var city = new City({
					no : cities[i].id,
					provinceNo: proNo,
					name:cities[i].name
				});
				cityBox.push(city);
			}
			req.session.cities = cityBox;
			res.redirect('/wea/index');
		}
	});
});

router.get('/queryCounty',function (req, res) {
	var cityNo = req.query.no;
	var queryurl = req.session.queryurl;
	var countyurl = queryurl+"/"+cityNo;
	var countyBox = [];
	delete req.session.queryurl;
	request(countyurl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var counties = JSON.parse(body);
			for(var i=0;i<counties.length;i++){
				var county = new County({
					no : counties[i].id,
					cityNo: cityNo,
					wid:counties[i].weather_id,
					name:counties[i].name
				});
				countyBox.push(county);
			}
			req.session.counties = countyBox;
			res.redirect('/wea/index');
		}
	});
});

router.get('/queryWeather',function (req, res) {
	var weatherid = req.query.wid;
	var weatherUrl = kfg.weatherUrl.replace('yourcity',weatherid);
	weatherUrl = weatherUrl.replace('yourkey',kfg.weatherKey);
	request(weatherUrl,function (error, response, body) {
		if (!error && response.statusCode == 200){
			var weather = wt.JsonWeather(body);
			weather.save(function (err, doc) {
				if (err) console.error(err);
				else {
					req.session.weather = weather;
					res.redirect('/wea/index');
				}
			})
 		}
	})
});


module.exports = router;