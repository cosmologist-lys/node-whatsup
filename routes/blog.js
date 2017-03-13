var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tool = require('../tool/tool');
var SysUser = require('../model/SysUser').Demo;
var fn = require('../tool/fn');


router.use(function (req, res, next) {
    console.info('进入blog.js:'+req.url);
    next();
});

router.get('/home',function (req, res) {
    /*console.log(JSON.stringify(req.session.user));
    if (tool.isNotNull(req.session.user)){
        var user = req.session.user;
        res.render('home',{user:user})
    }else{
        req.session.errmsg = 'ACOUNT WRONG!!!';
        res.redirect('/log');
    }*/
    res.render('home');
});

module.exports = router;
