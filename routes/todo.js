var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	var user = req.session.user;
	var time = new Date().toLocaleDateString();
	var flg = 'todo';
	res.render('todo/todoindex',
		{user:user,time:time,flg:flg});
});

router.post('/ajax',function (req, res) {
	var input = req.body.input;
	console.log('input:'+input);
	return res.send('success');
	res.redirect('/index');
});

module.exports = router;