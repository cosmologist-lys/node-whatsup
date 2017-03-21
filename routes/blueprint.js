var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var fn = require('../tool/fn');

router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	var user = req.session.user;
	var time = new Date().toLocaleDateString();
	var flg = 'blue';
	res.render('blueprint/bpindex',{flg:flg,time:time,user:user})
});

module.exports = router;