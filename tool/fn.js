var SysUser = require('../model/SysUser').Demo;
var tool = require('./tool.js');
var q = require('q');

var fn = {
    validateName : function (username) {
        SysUser.findOne({name : username},function (err, doc) {
            if (err) console.error(err);
            else{
                console.warn('validateName:'+doc);
                return (!tool.isNotNull(doc))? true : false;
            }
        });
    },
    validatePassword : function (psw) {
        return (psw.length>3)?true : false;
    }
};

module.exports = fn;