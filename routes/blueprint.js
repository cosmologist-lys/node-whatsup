const express = require('express');
const router = express.Router();
const tool = require('../tool/tool');
const fn = require('../tool/fn');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'public/images'});
const kfg = require('../kfg');
const ocr = require('baidu-ocr-api').create(kfg.apikey,kfg.secretkey);
const ocrUtil = require('../tool/ocrUtil');
const AipOcr = require('../sdk/src').ocr;

router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	var user = req.session.user;
	const time = new Date().toLocaleDateString();
	const translate = req.session.translate || '';
	res.render('blueprint/bpindex',{flg:'blue',time:time,user:user,translate:translate})
});

router.post('/index',upload.single('file'),function (req, res) {
	let fname = JSON.stringify(req.file['filename']);
	fname = fname.replace(/\"/g, "");
	const imgPath = 'F:/Devs_Kepl/JS-Projects/node-whatsup/public/images/'+fname;
	const image = fs.readFileSync(imgPath);
	/*ocrUtil.getToken(
		({token})=>{
			ocrUtil.getTranslate(token,image)
		}
	);*/
	const appid = '9915553',
		ak = 'Uaj4RnrULunU5QVyIsnmnjjR',
		sk = 'wqT4AlfgdUtGQBRLf4ovZBNBqUAuWqxA';
	const OcrClient = new AipOcr(appid, ak, sk);
	var base64Img = new Buffer(image).toString('base64');
	let result = '';
	OcrClient.generalBasic(base64Img).then(function(result) {
		result.words_result.forEach((w)=>{
			result += w['words'].trim().replace(/\"/g, "  ");
		})
		fs.unlink(imgPath,function (err) {
			if (err) console.error(err);
			else {
				req.session.translate = result;
				res.redirect('/blue/index');
			}
		})
	});


});

module.exports = router;