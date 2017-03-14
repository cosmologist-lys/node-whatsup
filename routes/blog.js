var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var fn = require('../tool/fn');
var Blog = require('../model/Blog').Demo;

router.use(function (req, res,next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/list',function (req, res) {
	var user = req.session.user;
	var id = user._id;
	//根据用户ID找属于他的BLOG
	Blog.find({authorid:id},function (err, docs) {
		if (!err) {
			var blogs = [];
			docs.forEach(function (doc) {
				var ctime = tool.timeFMT(doc.createTime);
				var etime = tool.timeFMT(doc.lastEditTime);
				doc.ctime = ctime;
				doc.etime = etime;
				blogs.push(doc)
			});
			res.render('bloglist',
				{blogs:blogs,user:user,time:new Date().toLocaleDateString()});
		}
	});
});

router.get('/add',function (req, res) {
	var user = req.session.user;
	res.render('addblog',{user:user,time:new Date().toLocaleDateString()});
});

router.post('/add',function (req, res) {
	var title = req.body.title;
	var short = req.body.shortCut;
	var content = req.body.content;
	if (tool.isNotNull(title,short,content)){
		var words = content.length;
		var blog = new Blog({
			title : title,
			author : req.session.user.name,
			authorid : req.session.user._id,
			shortCut : short,
			content : content,
			words : words
		});
		blog.save(function (err, doc) {
			if (!err) res.redirect('/blog/list');
		})
	}
});

router.get('/edit',function (req, res) {
	var id = req.query.id;
	var user = req.session.user;
	if (tool.isNotNull(id)){
		Blog.findById(id,function (err, doc) {
			if (!err) res.render('blogedit',{blog:doc,user:user,time:new Date().toLocaleDateString()});
		})
	}
});

router.post('/edit',function (req, res) {
	var title = req.body.title;
	var short = req.body.shortCut;
	var content = req.body.content;
	var id = req.body.id;
	if (tool.isNotNull(title,short,content)){
		var blog = new Blog({
			title : title,
			shortCut : short,
			author : req.session.user.name,
			authorid : req.session.user._id,
			content : content,
			words : content.length,
			lastEditTime : new Date()
		});
		/*Blog.findByIdAndUpdate(id,blog,function (err, doc) {
			if (!err) {
				console.log(doc);
				res.redirect('/blog/list');
			}
		})*/
		if (id && id !=''){
			Blog.findByIdAndUpdate(id,blog,function (err, docs) {
				if (err) console.error(err);
				else console.info('update '+docs);
				res.redirect('/blog/list');
			})
		}
	}
});

module.exports = router;