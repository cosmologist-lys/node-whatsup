var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tool = require('../tool/tool');
var SysUser = require('../model/SysUser').Demo;
mongoose.connect('mongodb://localhost/whatsup_sysuser');


router.use(function (req, res, next) {
  console.info('Enter index:'+req.url);
  next();
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'LALALAND'});
});

router.post('/',function (req, res) {
  var name = req.body.username;
  var psw = req.body.password;
    if (tool.isNotNull(name,psw)==false){
        console.info('create user');
        var user = new SysUser({
            //uid : tool.getUiid(),
            //role:1,
            name:name,
            password:tool.getCipher(psw)
            //creatTime:new Date().toLocaleDateString(),
            //lastLogTime:new Date().toLocaleDateString()
        });
       SysUser.findOne({name : name},function (err, doc) {
            console.error('find one'+doc);
            if (tool.getCipher(psw) == doc.password)
                res.render('home',{user : doc});
           else res.redirect('/');
       });
    }else{
        res.redirect('/');
    }
});

router.post('/reg',function (req, res) {
    console.info('reg');
    console.log(req.param());
    console.log(req.body.username);

});




module.exports = router;
