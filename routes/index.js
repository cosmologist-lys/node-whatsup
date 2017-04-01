var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tool = require('../tool/tool');
var SysUser = require('../model/SysUser').Demo;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/whatsup_sysuser');
var fn = require('../tool/fn');


router.use(function (req, res, next) {
  next();
});

var goIndex = router.get('/',function (req, res) {
    var img = "http://localhost:3000/bgimg/cosmos.jpg";
    res.render('index',{backimg:img});
});

router.get('/reg',function (req, res) {
    var session = JSON.stringify(req.session);
    var cookie = JSON.stringify(req.cookies);
    var sid = JSON.stringify(req.session.id);
    var cid = JSON.stringify(req.cookies["connect.sid"]);
    console.info('/reg session:' + session+'cookie:'+cookie+'sid:'+sid+'cid:'+cid);
    res.render('reg',{errmsg:''})
});

router.get('/log',function (req, res) {
    var sucmsg = req.session.sucmsg;
    var errmsg = req.session.errmsg ;
    var session = JSON.stringify(req.session);
    var cookie = JSON.stringify(req.cookies);
    var sid = JSON.stringify(req.session.id);
    var cid = JSON.stringify(req.cookies["connect.sid"]);
    res.render('log',{errmsg: errmsg,sucmsg:sucmsg})
});

router.post('/reg',function (req, res) {
    var name = req.body.username;
    var psw = req.body.password;
    if(tool.isNotNull(name,psw) && fn.validatePassword(psw)){
        console.log(name+psw);
        SysUser.findOne({name:name},function (err, doc) {
            if (err) console.error(err);
            else {
                if (tool.isNotNull(doc)){//重复注册
                    res.render('reg',{errmsg : 'Duplicated Account!!!'});
                }else{//可以注册
                    var user = new SysUser({
                        uid : tool.getUiid(),
                        role: 1,
                        name : name,
                        password : tool.getCipher(psw)
                    });
                    user.save(function (err, doc) {
                        if (!err){
                            req.session.user = doc;
                            req.session.sucmsg = 'Reg Successful!!!';
                            res.redirect('/log');
                        }
                    });
                }
            }
        });
    }else{
        res.render('reg',{errmsg : 'Input Error!!!'})
    }
});

router.post('/log',function (req, res) {
    var name = req.body.username;
    var psw = tool.getCipher(req.body.password);
    if (tool.isNotNull(name,psw)){
        //todo 1.验证session里是否有。2验证MONGO里是否有
        if (tool.isNotNull(req.session.user) && name == req.session.user.name && psw == req.session.user.password){
            res.redirect('/home/main');
        }else{
            SysUser.findOne({name : name,password:psw},function (err, doc) {
                if (err) console.error(err);
                else{
                    if (tool.isNotNull(doc)) {
                        doc.lastLogTime = new Date();
                        SysUser.findByIdAndUpdate(doc.id,doc,function (err, data) {
                            //console.error('find by id and update:'+data);
                            req.session.user = data;
                            res.redirect('/home/main');
                        })
                    }else{
                        req.session.errmsg = 'Acount Wrong!!!';
                        res.redirect('/log');
                    }
                }
            });
        }
    }else{
        req.session.errmsg = 'Input Wrong!!!';
        res.redirect('/log');
    }

});





module.exports = router;
