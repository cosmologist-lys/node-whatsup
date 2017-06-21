const express = require('express');
const router = express.Router();
const tool = require('../tool/tool');
const fn = require('../tool/fn');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'public/images'});
const kfg = require('../kfg');

const ocr = require('baidu-ocr-api').create(kfg.apikey,kfg.secretkey);


router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	const user = req.session.user;
	const time = new Date().toLocaleDateString();
	const translate = req.session.translate || '';
	res.render('blueprint/bpindex',{flg:'blue',time:time,user:user,translate:translate})
});

router.post('/index',upload.single('file'),function (req, res) {
	let fname = JSON.stringify(req.file['filename']);
	fname = fname.replace(/\"/g, "");
	const imgPath = 'F:/Devs_Kepl/JS-Projects/node-whatsup/public/images/'+fname;
	ocr.scan({
		url:imgPath,
		type:'text'
	}).then(function (result) {
		let translate = result;
		fs.unlink(imgPath,function (err) {
			if (err) console.error(err);
			else {
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