var express = require('express');
var router = express.Router();
var tool = require('../tool/tool');
var fn = require('../tool/fn');
const http = require('http');
const iconv = require('iconv-lite');
const BufferHelper = require('bufferhelper');
const cheerio = require('cheerio');
let Crawler = require('crawler');
var kfg = require('../kfg');


router.use(function (req, res, next) {
	if (!req.session.user) res.redirect('/');
	next();
});

router.get('/index', (req,res)=>{
	var user = req.session.user;
	const time = new Date().toLocaleDateString();
	const flg = 'music';
	const info_sel = kfg.douban_getSinger_Album,
		rating_sel = kfg.douban_getRating,
		pl_sel = kfg.douban_getPl,
		douban_url = kfg.doubanMusicTop250Url;
	console.time('总耗时');
	let allMsc = [],
		m1,m2,m3;
	for(let i = 0;i<10;i++){
		let page = '?start='+(i*25);
		let url = douban_url+page;
		const pro = promiseHelper;
		const mu = musicHelper;
		pro.getCrawler(url)
			.then(($)=>{
				pro.getSinger_Album($,info_sel)
					.then((msc)=>{
						m1 = msc;
					});
				pro.getRating_or_Pl($,pl_sel)
					.then((msc)=>{
						m2 = msc;
					});
				pro.getRating_or_Pl($,rating_sel)
					.then((msc)=>{
						m3 = msc;
					});
			}).then(()=>{
			if (m1!=undefined && m2!=undefined && m3!=undefined){
				let musicBox = mu.packMusic_onePage(m1,m2,m3);
				allMsc.push(musicBox);
				if (allMsc.length == 10){
					const box =
						mu.bubbleSort(
							mu.packMusic_allPage(allMsc)
						);
					console.timeEnd('总耗时');
					res.render('music/musiclist',
						{user:user,flg:flg,time:time,
						music:box})
				}
			}
		})
	}
});




let promiseHelper = {
	getPromise: function (url) {
		return new Promise((resolved, reject) => {
			http.get(url, (res) => {
				let buf = new BufferHelper();
				res.on('data', (data) => {
					buf.concat(data);
				});
				res.on('end', () => {
					if (undefined != buf && null != buf) {
						let ctx = iconv.decode(buf.toBuffer(), 'GBK');
						resolved(ctx);
					}
				})
			})
		})
	},
	getInfo : function (info) {//得到所有信息
		let $ = cheerio.load(info);
		let result =
			$.text().split('rr.firstInit(')[1]
				.split(' .content')[0].trim()
				.split(');')[0];
		let ctx = result
			.toString()
			.split('[')[1]
			.split(']');
		delete result;
		return ctx;
	},
	getDetail : function (info) {//得到页面个数总数日期等信息
		const detailBox = [];
		if (info!= undefined && info!=null && info.length>0){
			let detailStr = info[1];
			//,"pages":"774","update":"2017-05-25","count":"38673"}
			detailStr = detailStr.split('\":"');
			let pages = detailStr[1]
				.split('\","')[0].toString();
			let update = detailStr[2]
				.split('\","')[0].toString();
			let count = detailStr[3]
				.split('\"')[0].toString();
			const detail = {
				'pages':pages,
				'update':update,
				'count':count
			};
			return detail ;
		}else return null;
	},
	getModel: function (info,str) {//得到每个对象
		let onlyInfo = info[0];
		let onlyInfoSplit = onlyInfo.split('\","');
		//console.error(onlyInfoSplit)打印
		let list = [];
		for(let o in onlyInfoSplit){
			let model =[];
			let stock = onlyInfoSplit[o].split(',');
			let len = stock.length;
			if (len == 12){
				model = {
					'no':stock[3],
					'update': stock[1],
					'cat':stock[10],
					'flu':stock[11].replace('\"',''),
					'title':stock[9],
					'rat':stock[7],
					'ratc':stock[0].replace('\"',''),
					'org':stock[4],
					'trend':stock[8]
				};
			}
			list.push(model);
		}
		return list;
	},

	pack : function (info) {
		if (info == undefined) throw new Error('pack function cannot take undefined params');

	},
	getCrawler : function (url) {
		return new Promise( (resolved,reject) =>{
			let c = new Crawler({
				maxConnections : 10,
				callback : function (error, res, done) {
					if(error){
						reject(error);
					}else{
						let $ = res.$;
						resolved($);
					}
					done();
				}
			});
			c.queue(url);
		})},
	getSinger_Album : function ($,selector) {//得到歌手和专辑信息
		if ($ == undefined || $ == '') throw new Error('$ is null baby');
		return new Promise((reso,reje)=>{
			var msc = [];
			$(selector).each(function(i, elem) {
				let songInfo = $(this).attr().alt;
				songInfo = songInfo.split('-');
				const singer = songInfo[0];
				const album = songInfo[1];
				const piece = {
					'singer':singer,
					'album':album
				};
				msc[i] = piece;
			});
			reso(msc);
		})
	},
	getRating_or_Pl : function ($,selector) {//得到打分和评价人数信息
		if ($ == undefined || $ == '') throw new Error('$ is null baby');
		return new Promise((reso,reje)=>{
			var msc = [];
			$(selector).each(function(i, elem) {
				let info = $(this).text().trim();
				if (info.length >3){
					//评价人数
					let reg = /\d+/g;//提取数字
					info = info.match(reg);
				}else{
					//打分
					info = info.trim();
				}
				msc[i] = info;
			});
			reso(msc);
		})
	}
};

const musicHelper = {
	packMusic_onePage : function (m1, m2, m3) {//把信息组合到一起
		if (m1 && m2 && m3){
			const len = m1.length;
			const musicBox = [];
			for(let i = 0;i<len;i++){
				const piece = {
					'singer':m1[i].singer,
					'album':m1[i].album,
					'rating':m3[i],
					'pl':m2[i]
				};
				musicBox.push(piece);
			}
			return musicBox;
		}else{
			console.error('m1='+m1.length+'m2='+m2.length+'m3='+m3.length);
			throw new Error('length not fit baby');
		}
	},
	packMusic_allPage : function (allMsc) {
		const totalLen = allMsc.length;
		const box = [];
		for(let msc of allMsc){
			for(let m of msc){
				const piece = {
					'singer':m.singer,
					'album':m.album,
					'rating':m.rating,
					'pl':m.pl
				};
				box.push(piece);
			}
		}
		return box;
	},
	bubbleSort : function(box,dir = 'desc'){
		for(var i=0;i<box.length-1;i++){
			for(var j=i+1;j<box.length;j++){
				const m1 = Number(box[i].rating)*10;
				const m2 = Number(box[j].rating)*10;
				if (dir.toUpperCase() == 'DESC'){
					if(m1<m2){
						var temp=box[i];
						box[i]=box[j];
						box[j]=temp;
					}
				}
				if (dir.toUpperCase() == 'ASC'){
					if(m1>m2){
						var temp=box[i];
						box[i]=box[j];
						box[j]=temp;
					}
				}
			}
		}
		return box;
	},
	statis : function (box) {
		const statisBox = [];
		for(let i=0;i<box.length;i++){
			let name = box[i].singer;
			let count = 1;
			let totalRating = Number(box[i].rating);
			let totalPL = Number(box[i].pl);
			for(let j=i+1;j<box.length;j++){
				if (name == box[j].singer) {
					count++;
					totalRating += box[j].rating;
					totalPL += box[j].pl;
					box.pop(box[j]);box.pop(box[i]);
				}
			}
			console.error('第'+i+'次：'+box.length);
			count = 0?1:count;
			const statis = {
				singer:name,
				albumCnt : count,
				avgRating : totalRating/count,
				avgPl : totalPL/count
			};
			statisBox.push(statis);
		}
		return statisBox;
	}
};


module.exports = router;