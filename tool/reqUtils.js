var request = require('request');
var kfg = require('../kfg');
var City = require('../model/City').Demo;
var Province = require('../model/Province').Demo;
var County = require('../model/County').Demo;
var Area = require('../model/Area').Demo;
var tool = require('../tool/tool');

var reqUtil = {
	queryProvince : function () {
		request(kfg.prurl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var pros = JSON.parse(body);
				for(var i=0;i<pros.length;i++){
					var pro = new Province({
						no : pros[i].id,
						areaNo: tool.randomInArea(),
						name:pros[i].name
					});
					pro.save(function (err, doc) {
						if (err) console.error(err);
					})
				}
			}
		});
	},
	queryCity : function (proNo) {
		var url = kfg.prurl+"/'"+proNo+"'";
		request(url,function (error, res, body) {
			if (!error && res.statusCode == 200) {
				var cities = JSON.parse(body);
				for(var i =0;i<cities.length;i++){
					var city = new City({
						no : cities[i].id,
						provinceNo:Number(proNo),
						name:cities[i].name
					});
					city.save(function (err, doc) {
						if (err) console.error(err);
					})
				}
			}
		})
	},
	queryCounty : function (proNo,cityNo) {
		var url = kfg.prurl+"/'"+proNo+"/"+cityNo+"'";
		request(url,function (error, res, body) {
			if (!error && res.statusCode ==200){
				var counties = JSON.parse(body);
				for(var i=0;i<counties.length;i++){
					var county = new County({
						no : counties[i].id,
						cityNo:cityNo,
						name:counties[i].name
					});
					county.save(function (err, doc) {
						if(err) console.error(err)
					})
				}
			}
		})
	},
	downloadAllLocationInfo : function () {
		request(kfg.prurl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var los = JSON.parse(body);
				for(var i=0;i<los.length;i++){
					var pro = new Province({
						no : los[i].id,
						name:los[i].name
					});
					pro.save(function (err, doc) {
						if (err) console.error(err);
					});
					var proid = los[i].id;
					var cityurl = kfg.prurl+'/'+''+los[i].id+'';
					request(cityurl,function (error1, response1, body1) {
						var los1 = JSON.parse(body1);
						for(var j=0;j<los1.length;j++){
							var city = new City({
								no : los1[j].id,
								provinceNo:proid,
								name : los1[j].name
							});
							city.save(function (err1,doc1) {
								if (err1) console.error(err1);
							});
							var cityid = los1[j].id;
							var cnurl = cityurl+'/'+''+los1[j]+'';
							request(cnurl,function (error2,response2,body2) {
								var los2 = JSON.parse(body2);
								for(var k=0;k<los2.length;k++){
									var county = new County({
										no : los2[k].id,
										cityNo:cityid,
										name : los2[k].name
									});
									county.save(function (err2, doc2) {
										if (err2) console.error(err2);
									})
								}
							})
						}
					})
				}
			}
		});
	}
};



module.exports = reqUtil;