var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var tool = require('../tool/tool');
var SysUser = require('../model/SysUser').Demo;
mongoose.connect('mongodb://localhost/whatsup_sysuser');
var fn = require('../tool/fn');

router.use(function (req, res, next) {
  console.error('Enter index:'+req.cookies.toString());
  next();
});

router.get('/', function(req, res) {
    res.render('log',{sucmsg : '',errmsg : ''});
});

router.post('/',function (req, res) {
    var name = req.body.username;
    var psw = tool.getCipher(req.body.password);
    if (tool.isNotNull(name,psw)){
        SysUser.findOne({name : name,password:psw},function (err, doc) {
            if (err) console.error(err);
            else{
                if (tool.isNotNull(doc)) {
                    doc.lastLogTime = new Date();
                    SysUser.findByIdAndUpdate(doc.id,doc,function (err, data) {
                        console.error('find by id and update:'+data);
                        res.render('home',{user:data});
                    })
                }
                else res.render('log',{errmsg :'Acount Wrong!!!',sucmsg:''})
            }
        });
    }else{
        res.render('log',{errmsg :'Input Wrong!!!',sucmsg:''})
    }
});


router.get('/reg',function (req, res) {
    res.render('reg',{errmsg : '',sucmsg :''});
});
router.post('/reg',function (req, res) {
    var name = req.body.username;
    var psw = req.body.password;
    if(tool.isNotNull(name,psw) && fn.validatePassword(psw)){
        SysUser.findOne({name:name},function (err, doc) {
            if (err) console.error(err);
            else {
                if (tool.isNotNull(doc)){//重复注册
                    console.error('reg post user.findone:'+doc);
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
                            console.info(req.session.user+"----"+req.session);
                            res.render('log',{sucmsg : 'Reg Successful!!!',errmsg : ''});
                        }
                    });
                }
            }
        });
    }else{
        res.render('reg',{errmsg : 'Input Error!!!'})
    }
});




module.exports = router;
