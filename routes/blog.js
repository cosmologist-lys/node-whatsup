var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var fn = require('../tool/fn');
var Blog = require('../model/Blog').Demo;

router.use(function (req, res,next) {
	if (!req.session.user) res.redirect('/');
	next();
});
//header.html页面tag标签如何在赋值之后再进行渲染？而不是先渲染
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
			var flg = 'blog';//激活标志
			res.render('blog/bloglist',
				{flg:flg,blogs:blogs,user:user,time:new Date().toLocaleDateString()});
		}
	});
});

router.get('/add',function (req, res) {
	var user = req.session.user;
	var flg = 'blog';
	res.render('blog/addblog',{flg:flg,user:user,time:new Date().toLocaleDateString()});
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
	var flg ='blog';
	if (tool.isNotNull(id)){
		Blog.findById(id,function (err, doc) {
			if (!err) res.render('blog/blogedit',{flg:flg,blog:doc,user:user,time:new Date().toLocaleDateString()});
		})
	}
});

router.post('/edit',function (req, res) {
	var title = req.body.title;
	var short = req.body.shortCut;
	var content = req.body.content;
	var id = req.body.id;
	var authorid = req.session.user._id;
	console.info('authorid='+authorid);
	if (tool.isNotNull(title,short,content)){
		var blog = new Blog({
			title : title,
			shortCut : short,
			author : req.session.user.name,
			authorid : authorid,
			content : content,
			words : content.length,
			lastEditTime : new Date()
		});
		if (id && id !=''){
			/*Blog.findByIdAndUpdate(id,blog,function (err, docs) {
				if (err) console.error(err);
				else console.info('update '+docs);
				res.redirect('/blog/list');
			});*/
			Blog.update({_id:id},
				{$set:{title:title,shortCut:short,author : req.session.user.name,
					authorid : authorid,
					content : content,
					words : content.length,
					lastEditTime : new Date()}},function (err) {
					if (!err) res.redirect('/blog/list');
				});
		}
	}
});

router.get('/delete',function (req, res) {
	var id = req.query.id;
	if (id && id!=''){
		Blog.findByIdAndRemove(id,function (err, doc) {
			if (err) console.error('FINDBYIDANDREMOVE ERR:'+err)
			else res.redirect('/blog/list');
		});
	}
});

module.exports = router;