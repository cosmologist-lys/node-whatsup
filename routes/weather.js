let express = require('express');
let router = express.Router();
let Province = require('../model/Province').Demo;
let City = require('../model/City').Demo;
let County = require('../model/County').Demo;
let Area = require('../model/Area').Demo;
let tool = require('../tool/tool');
let reqUtils = require('../tool/reqUtils');
let wt = require('../tool/weatherTool');
let request = require('request');
let kfg = require('../kfg');
let Weather = require('../model/Weather').Demo;


router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});


router.get('/index',function (req, res) {
	let user = req.session.user;
	let time = new Date().toLocaleDateString();
	let flg = 'weather';
	let areas = [];
	let pros = req.session.provinces;
	let cities = req.session.cities;
	let counties = req.session.counties;
	let weather = req.session.weather;
	let png = '' ,sg = '';
	if (weather != undefined){
		png = wt.loadPic(weather.now.txt);
		sg = weather.suggestion.conf;
	}
	let weatherList = [];
	Area.find(function (err, docs) {
		if (tool.isNotNull(docs)) areas = docs;
		Weather.find().sort({_id:-1}).limit(5).exec(function (err, weas) {//分页查询，限制查询 id:1升序 id:-1降序
			if (err) console.error(err);
			for (let num in weas){
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
	let areaNo = req.query.no;
	Province.find({areaNo : areaNo},function (err, docs) {
		if (!err) req.session.provinces = docs;
		else  console.error(err);
		res.redirect('/wea/index');
	})
});

router.get('/queryCity',function (req, res) {
	let proNo = req.query.no;
	let cityurl = kfg.prurl+"/"+proNo;
	req.session.queryurl = cityurl;
	let cityBox = [];
	request(cityurl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let cities = JSON.parse(body);
			for(let i=0;i<cities.length;i++){
				let city = new City({
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
	let cityNo = req.query.no;
	let queryurl = req.session.queryurl;
	let countyurl = queryurl+"/"+cityNo;
	let countyBox = [];
	delete req.session.queryurl;
	request(countyurl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let counties = JSON.parse(body);
			for(let i=0;i<counties.length;i++){
				let county = new County({
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
	let weatherid = req.query.wid;
	let weatherUrl = kfg.weatherUrl.replace('yourcity',weatherid);
	weatherUrl = weatherUrl.replace('yourkey',kfg.weatherKey);
	request(weatherUrl,function (error, response, body) {
		if (!error && response.statusCode == 200){
			let weather = wt.JsonWeather(body);
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