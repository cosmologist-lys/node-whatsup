const express = require('express');
const router = express.Router();
const tool = require('../tool/tool');
const SysUser = require('../model/SysUser').Demo;
const fn = require('../tool/fn');


router.use(function (req, res, next) {
    if (!tool.isNotNull(req.session.user)) res.redirect('/');
    next();
});

router.get('/main',  function (req, res) {
     if (tool.isNotNull(req.session.user)){
        const user = req.session.user;
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
