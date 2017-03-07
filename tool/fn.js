var SysUser = require('../model/SysUser').Demo;
var tool = require('./tool.js');


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
        if (!tool.isNotNull(psw))
            var len = psw.length;
        return (len>3)?true : false;
    }
};

module.exports = fn;