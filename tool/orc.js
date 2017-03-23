var apikey = "b351ec2de1e948afac53bb994c16446a";
var secretkey = "f202e75b15514cb6a84b2b161ea252ac";
var ocr = require('baidu-ocr-api').create(apikey,secretkey);
var jpg = 'F:/Devs_Kepl/JS-Projects/node-whatsup/public/images/ch1.jpg';

var bdch = {
	scan : ocr.scan({
		//url:'http://7pun4e.com1.z0.glb.clouddn.com/test.jpg', // 支持本地路径
		url:jpg,
		type:'text'
	}).then(function (result) {
		console.log(result);
		return result.toString();
	}).catch(function (err) {
		console.error('err', err);
	})
};

module.exports = bdch;