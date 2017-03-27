var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var fn = require('../tool/fn');
var orc = require('../tool/orc');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'public/images'});
var kfg = require('../kfg');

var ocr = require('baidu-ocr-api').create(kfg.apikey,kfg.secretkey);


router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	var user = req.session.user;
	var time = new Date().toLocaleDateString();
	var translate = req.session.translate || '';
	res.render('blueprint/bpindex',{flg:'blue',time:time,user:user,translate:translate})
});

router.post('/index',upload.single('file'),function (req, res) {
	var fname = JSON.stringify(req.file['filename']);
	fname = fname.replace(/\"/g, "");
	var imgPath = 'F:/Devs_Kepl/JS-Projects/node-whatsup/public/images/'+fname;
	//var translate = orc.scan(imgPath);
	ocr.scan({
		url:imgPath,
		type:'text'
	}).then(function (result) {
		var translate = result;
		fs.unlink(imgPath,function (err) {
			if (err) console.error(err);
			else {
				console.log('delete suc!');
				translate = JSON.stringify(translate['results']['words']);
				req.session.translate = translate;
				res.redirect('/blue/index');
			}
		})
	}).catch(function (err) {
		console.error('err', err);
	});
});

module.exports = router;