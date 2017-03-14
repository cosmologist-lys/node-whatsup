var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var SysUser = require('../model/SysUser').Demo;
var fn = require('../tool/fn');


router.use(function (req, res, next) {
    if (!tool.isNotNull(req.session.user)) res.redirect('/');
    next();
});

router.get('/main',  function (req, res) {
    //console.log('/main user:'+JSON.stringify(req.session.user));
     if (tool.isNotNull(req.session.user)){
        var user = req.session.user;
        //res.render('home',{user:user,time:new Date().toLocaleDateString()})
         res.redirect('/blog/list');
     }else{
        req.session.errmsg = 'ACOUNT WRONG!!!';
        res.redirect('/log');
     }
});

router.get('/logout',function (req, res) {
    console.log('/jinru logout');
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
