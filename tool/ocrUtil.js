const axios = require('axios');
const querystring = require('querystring');

const ocrUtil = {
	getToken : (fun)=>{
		if (typeof fun !== 'function') return;
		axios({
			method: 'post',
			url : 'http://aip.baidubce.com/oauth/2.0/token',
			params: {
				grant_type: 'client_credentials',
				client_id: 'eVMGd83X4cbKLiTxGG4MlmZf',
				client_secret: 'OOKXP3dXRGxvUU4jyhVMZmZ9FxYPaQ54'
			}
		}).
		then(({data}) =>{
			const token = data.access_token;
			fun(token);
		}).
		catch((err)=>{
			console.error(err)
		});
	},
	getTranslate : (token,img)=>{
		axios({
			method: 'post',
			url:'http://aip.baidubce.com/rest/2.0/ocr/v1/general',
			params: {
				access_token: token
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data : querystring.stringify({
				image: new Buffer(img).toString('base64')
			})
		}).then(({data}) => console.log(data))
			.catch((err_)=>{
				console.error(err_)
			});
	}
}


module.exports = ocrUtil;