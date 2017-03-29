var Province = require('../model/Province').Demo;
var City = require('../model/City').Demo;
var County = require('../model/County').Demo;
var Area = require('../model/Area').Demo;

var pack = {
	packArea : function () {
		var areas = [];
		var areaWest = new Area({
			no : 1,
			name :'west'
		});
		areaWest.save(function (err, doc) {
			if (err) console.error(err);
		});
		var areaNorth = new Area({
			no : 2,
			name :'notrh'
		});
		areaNorth.save(function (err, doc) {
			if (err) console.error(err);
		});
		var areaEast = new Area({
			no : 3,
			name :'east'
		});
		areaEast.save(function (err, doc) {
			if (err) console.error(err);
		});
		var areaSouth = new Area({
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
	}
};

module.exports = pack;