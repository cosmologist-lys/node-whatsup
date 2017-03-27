var express = require('express');
var router = express.Router();
var Province = require('../model/Province').Demo;
var City = require('../model/City').Demo;
var County = require('../model/County').Demo;
var reqUtil = require('../tool/reqUtils');
var tool = require('../tool/tool');

router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

/*router.get('/index',function (req, res) {
	request(kfg.cturl, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	 //console.log(body);
	 var cities = JSON.parse(body);
	 for(var i=0;i<cities.length;i++){
	 	//console.error(cities[i].id+'=='+cities[i].name)
		 var city = new City({
		 	no : cities[i].id,
			 name:cities[i].name
		 });
		 city.save(function (err, doc) {
		 	if (err) console.error(err);
		 })
	 }
		var user = req.session.user;
		var time = new Date().toLocaleDateString();
		var flg = 'weather';
		var cities = [];
		res.render('weather/weatherlist',{user:user,flg:flg,time:time,cities:cities});
	 }
	});
});*/

router.get('/index',function (req, res) {
	var user = req.session.user;
	var time = new Date().toLocaleDateString();
	var flg = 'weather';
	var cities = [];
	Province.find(function (err, docs) {
		if(tool.isNotNull(docs)){
			console.log('not null');
			cities = docs;
		}else{
			console.log('is null');
			reqUtil.queryProvince();
		}
		res.render('weather/weatherlist',{user:user,flg:flg,time:time,cities:cities});
	})
});

router.post('/index',function (req, res) {

});


module.exports = router;