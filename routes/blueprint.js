var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var fn = require('../tool/fn');
var orc = require('../tool/orc');
var fs = require('fs');



router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	var user = req.session.user;
	var time = new Date().toLocaleDateString();
	var result = orc.scan;
	res.render('blueprint/bpindex',{flg:'blue',time:time,user:user})
});

router.post('/index',function (req, res) {
	var stream = req.body.img;
	fs.writeFileSync()
	if(stream) console.error(stream.toString());
});

module.exports = router;