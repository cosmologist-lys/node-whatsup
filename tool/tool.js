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
        if (cnt>0) return false;
        else return true;
    },
    getCid : function (req) {
        var cid = JSON.stringify(req.cookies["connect.sid"]);
        return cid.split(':')[1].split('.')[0];
    },
    getSid : function (req) {
        return JSON.stringify(req.session.id);
    },
    cidEQsid : function (req) {
        var cid = JSON.stringify(req.cookies["connect.sid"]);
        cid = cid.split(':')[1].split('.')[0];
        var sid = JSON.stringify(req.session.id);
        sid = sid.substring(1,sid.length-1);
        return (cid == sid);
    },
	timeFMT : function (time) {
		var da = new Date(time);
		var year = da.getFullYear()+'年';
		var month = da.getMonth()+1+'月';
		var date = da.getDate()+'日';
		var hour = da.getHours();
		var min = da.getMinutes();
		min = min.toString().length<2? '0'+min:min;
		return [year,month,date].join('')+[hour,min].join(':');
	},
	randomInArea : function () {
		var guess = Math.floor(Math.random()*10);
		var cb;
		if ( 0 <= guess && guess <= 2 ) cb = 1;
		else if ( 3 <= guess && guess <= 4) cb = 2;
		else if ( 5 <= guess && guess <= 7) cb = 3;
		else cb = 4;
		return cb;
	},
	isContains : function (str, substr) {
	if (arguments.length == 2)
		return str.indexOf(substr) >= 0;
	else if (arguments.length > 2)
		for(var sub in substr){
			if (str.indexOf(substr[sub]) < 0) return false;
			return;
		}
	}
};

module.exports = util;