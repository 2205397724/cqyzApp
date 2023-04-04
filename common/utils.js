import Cache from "@/pages/framework/utils/cache/cache.js"
import {TOKEN,REGION,ZONE,USER_INFO, UID} from "@/pages/framework/config/cache.js"
import {EQTYPE,SECRET} from '@/pages/framework/config/app.js';
import SHA256 from 'crypto-js/sha256';
import request from "@/pages/framework/utils/request/request.js";
//局部拉取用户方法
function _getuser(){
	let uid = Cache.get(UID)
	let users= Cache.get(uid+'_info')
	return users ? users : {}
}
// 获取SING
function getSign(){
	let time = new Date().getTime().toString()
	let eqtype = EQTYPE
	let secret = SECRET
	let sign = SHA256(time+eqtype+secret)
	return [time, eqtype, sign].join('.')
}
// 跳转
function route(url){
	let userCity = getUserCity()
	if(!userCity.hasOwnProperty('china_code')){
		uni.showToast({
			icon:'none',
			title: '请在首页选择城市！',
		})
		return false
	}
	uni.navigateTo({
		url: url
	})
}
// 获取token
function getToken(){
	let token = Cache.get(TOKEN)
	if(!token){
		uni.showToast({
			icon: 'none',
			title: '登录失效，请重新登录！',
			duration: 1000
		})
		setTimeout(()=>{
			uni.reLaunch({
				url: '/pages/page/login/login'
			});
		},1000)
		
		return false
	}
	return token
}
//拉取用户
function getUser(){
	let users = _getuser()
	if(Object.keys(users).length<=0){
		setTimeout(()=>{
			uni.reLaunch({
				url: '/pages/page/login/login'
			});
		},1000)
		return false;
	}
	return users
}
//获取用户角色
function getUserRole(){
	let uid = Cache.get(UID)
	return Cache.get(uid+'_role') ? Cache.get(uid+'_role'): 'user'
}
//获取用户城市
function getUserCity(){
	let uid = Cache.get(UID)
	return Cache.get(uid+'_region') ? Cache.get(uid+'_region'): {}
}
//获取用户组织
function getUserGroups(){
	let uid = Cache.get(UID)
	return Cache.get(uid+'_groups') ? Cache.get(uid+'_groups'): {}
}
//获取用户小区
function getUserZone(){
	let uid = Cache.get(UID)
	return Cache.get(uid+'_zone') ? Cache.get(uid+'_zone'): {}
}
//获取用户房屋
function getUserHouse(){
	let uid = Cache.get(UID)
	return Cache.get(uid+'_house') ? Cache.get(uid+'_house'): {}
}
//获取用户认证的企业
function getUserCompany(){
	let uid = Cache.get(UID)
	return Cache.get(uid+'_company') ? Cache.get(uid+'_company'): {}
}
//设置用户信息(键名，数据)
function setUser(key,data){
	let uid = Cache.get(UID)
	let userinfo = _getuser()
	if(!userinfo){
		setTimeout(()=>{
			uni.reLaunch({
				url: '/pages/page/login/login'
			});
		},1000)
		return false;
	}
	Cache.set(uid+'_'+key,data)
	return true
}
//判断是否实名认证
function isVerify(){
	let userinfo = _getuser()
	let status_cert = userinfo.status_cert
	// 判断是否进行了实名认证
	if(status_cert != 20){
		// uni.showToast({
		// 	icon:'none',
		// 	title: '请先进行实名认证！',
		// 	mask:true,
		// 	duration:2000
		// })
		// setTimeout(()=>{
		// 	uni.navigateTo({
		// 		url:"/pages/mine/verify/verify"
		// 	})
		// },2000)
		uni.navigateTo({
			url:"/pages/mine/verify/verify"
		})
	}
}
function urlParams(params){
	let url = ''
	Object.keys(params).sort().map(key => {
	    if(params[key] != undefined || params[key] != 'undefined'){
			url += key+'='+params[key]+'&'
		}
	})
	return url.substring(0, url.length - 1)
}
// 跳转到 网页 this.utils.jumpWebpage(url)
function jumpWebpage(url) {
	uni.navigateTo({
		url:'/pages/page/browser/view/index?url=' + encodeURIComponent(JSON.stringify(url))
	})
}
// 跳转到 小程序  "微信"
function jumpApplet(name, id, path) {
	var pusher = plus.share.getServices(function(service){
		let has = false
		for(var i in service){
			let shares = service[i]
			if(shares.description == name){
				has = true
				uni.showModal({
					title: '小程序',
					content: `即将打开“${name}”！`,
					success: function(res) {
						if (res.confirm) {
							shares.launchMiniProgram({
								id: id,
								path: path
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				break
			}
		}
		if(!has){
			uni.showToast({
				icon:'none',
				title:`无“${name}”分享服务！`
			})
		}
	}, function(e){
		console.log("获取分享服务列表失败："+e.message);
		uni.showToast({
			icon:'none',
			title:`获取分享服务列表失败！`
		})
	});
}

// 跳转到 电话
function jumpTel(tel) {
	uni.showModal({
		title: '拨号',
		content: `确定呼叫${tel}？`,
		success: function(res) {
			if (res.confirm) {
				// 拨打客服电话
				uni.makePhoneCall({
					phoneNumber: tel
				});
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	});
}
// 是不是当前小区业委会成员
function isYwh(){
	let group = getUserGroups()
	let zone = getUserZone()
	if(Object.keys(group).length>0){
		if(group.type==6 && group.region_type==2 && zone.id == group.region_val){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}
// 相隔天数
function dateDiff(endata,startdata){
	let day = 24 * 60 * 60 *1000;
	try{    
		let dateArr = endata.split("-")
		let checkDate = new Date()
		checkDate.setFullYear(dateArr[0], dateArr[1]-1, dateArr[2].split(" ")[0])
		let checkTime = checkDate.getTime()
		let dateArr2 = startdata.split("-")
		let checkDate2 = new Date()
		checkDate2.setFullYear(dateArr2[0], dateArr2[1]-1, dateArr2[2].split(" ")[0])
		let checkTime2 = checkDate2.getTime()
		let cha = Math.floor((checkTime - checkTime2)/day)
		return cha
	}catch(e){
		return false;
	}
}
function share(data){
	const uniShare = new UniShare();
	uniShare.show({//公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
		content: data,
		menus: [{
				"img": "/static/sharemenu/wx.png",
				"text": "微信好友",
				"share": { //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
					"provider": "weixin",
					"scene": "WXSceneSession"
				}
			},
			{
				"img": "/static/sharemenu/pyq.png",
				"text": "微信朋友圈",
				"share": {
					"provider": "weixin",
					"scene": "WXSceneTimeline"
				}
			},
			// {
			// 	"img": "/static/sharemenu/mp_weixin.png",
			// 	"text": "微信小程序",
			// 	"share": {
			// 		provider: "weixin",
			// 		scene: "WXSceneSession",
			// 		type: 5,
			// 		miniProgram: {
			// 			id: '123',
			// 			path: '/pages/list/detail',
			// 			webUrl: '/#/pages/list/detail',
			// 			type: 0
			// 		},
			// 	}
			// },
			{
				"img": "/static/sharemenu/weibo.png",
				"text": "微博",
				"share": {
					"provider": "sinaweibo"
				}
			},
			{
				"img": "/static/sharemenu/qq.png",
				"text": "QQ",
				"share": {
					"provider": "qq"
				}
			},
			{
				"img": "/static/sharemenu/copy.png",
				"text": "复制",
				"share": "copyurl"
			},
			{
				"img": "/static/sharemenu/more.png",
				"text": "更多",
				"share": "shareSystem"
			}
		],
		cancelText: "取消分享",
	},e => {
		console.log(e);
	})
}
module.exports = {
    getSign			:	getSign,
	route			:	route,
	getToken		:	getToken,
	getUser			:	getUser,
	getUserCity		:	getUserCity,
	getUserZone		:	getUserZone,
	getUserHouse	:	getUserHouse,
	getUserGroups	:	getUserGroups,
	getUserCompany	:	getUserCompany,
	getUserRole		:	getUserRole,
	setUser			:	setUser,
	isVerify		:	isVerify,
	jumpWebpage		:	jumpWebpage,
	jumpTel			:	jumpTel,
	jumpApplet		:	jumpApplet,
	isYwh			:	isYwh,
	dateDiff		:	dateDiff,
	share			:	share,
	urlParams		:	urlParams,
}