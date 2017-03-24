var apikey = "b351ec2de1e948afac53bb994c16446a";
var secretkey = "f202e75b15514cb6a84b2b161ea252ac";
var ocr = require('baidu-ocr-api').create(apikey,secretkey);
//var jpg = 'F:/Devs_Kepl/JS-Projects/node-whatsup/public/images/ch1.jpg';

var bdch = {
	scan : function (jpg) {
		ocr.scan({
			url:jpg,
			type:'text'
		}).then(function (result) {
			return result.toString();
		}).catch(function (err) {
			console.error('err', err);
		})
	}
};

module.exports = bdch;