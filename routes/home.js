var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tool = require('../tool/tool');
var SysUser = require('../model/SysUser').Demo;
var fn = require('../tool/fn');


router.use(function (req, res, next) {
    console.info('进入blog.js:'+req.url);
    var session = req.session || {};
    var query = req.query || {};
    if (session.size>0) console.info('blog session:'+session);
    if (query.size>0) console.info('blog.query:'+query);
    next();
});

router.get('/main',function (req, res) {
    console.log('/main user:'+JSON.stringify(req.session.user));
     if (tool.isNotNull(req.session.user)){
        var user = req.session.user;
        res.render('home',{user:user,time:new Date().toLocaleDateString()})
     }else{
        req.session.errmsg = 'ACOUNT WRONG!!!';
        res.redirect('/log');
     }
});

module.exports = router;
