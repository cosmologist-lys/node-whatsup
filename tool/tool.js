var crypto = require('crypto');

var util = {
    getUiid : function () {
        return 'xxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    getCipher : function (password) {
        var md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    },
    isNotNull : function (args) {
        var cnt = 0;
        var len = arguments.length;
        for(var i=0;i<len;i++){
            var arg = arguments[i];
            if (arg=='' || arg ==null || arg=='undefine')
                cnt++;
        }
        if (cnt>0) return true;
        else return false;
    }
};

module.exports = util;