const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index',function (req, res) {
	const user = req.session.user;
	const time = new Date().toLocaleDateString();
	const flg = 'todo';
	res.render('todo/todoindex',
		{user:user,time:time,flg:flg});
});

router.post('/ajax',function (req, res) {
	const input = req.body.input;
	console.log('input:'+input);
	return res.send('success');
	res.redirect('/index');
});

module.exports = router;