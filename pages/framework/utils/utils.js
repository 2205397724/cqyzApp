import Cache from "@/pages/framework/utils/cache/cache.js"
import {TOKEN,REGION,ZONE,USER_INFO, UID} from "@/pages/framework/config/cache.js"
import {EQTYPE,SECRET} from '@/pages/framework/config/app.js';
import SHA256 from 'crypto-js/sha256';
import request from "@/pages/framework/utils/request/request.js";
class utils {
	constructor(handler) {};
	
	// 获取SING
	getSING(){
		let time = new Date().getTime().toString()
		let eqtype = EQTYPE
		let secret = SECRET
		let sign = SHA256(time+eqtype+secret)
		return [time, eqtype, sign].join('.')
	}
	// 跳转
	route(url){
		if(!Cache.get(REGION)&&!Cache.get(REGION).base_url){
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
	getToken(){
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
	getUser(){
		let uid = Cache.get(UID)
		let users= this.utils.getUser()
		if(!users[uid]){
			setTimeout(()=>{
				uni.reLaunch({
					url: '/pages/page/login/login'
				});
			},1000)
			return false;
		}
		return users[uid]
	}
	//设置用户信息(键名，数据)
	setUser(key,data){
		let uid = Cache.get(UID)
		let users = this.utils.getUser()
		let userinfo = users[uid]
		if(!userinfo){
			setTimeout(()=>{
				uni.reLaunch({
					url: '/pages/page/login/login'
				});
			},1000)
			return false;
		}
		userinfo[key] = data
		Cache.set(USER_INFO,{[uid]:userinfo})
		return true
	}
	//判断是否实名认证
	judgeCertification(){
		let status_cert = this.utils.getUser().status_cert
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
	
	// 跳转到 网页 this.utils.jumpWebpage(url)
	jumpWebpage(url) {
		uni.navigateTo({
			url:'/pages/page/browser/view/index?url=' + encodeURIComponent(JSON.stringify(url))
		})
	}
	// 跳转到 小程序  "微信" 
	// this.utils.jumpApplet('微信', id, path)
	jumpApplet(name, id, path) {
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
	jumpTel(tel) {
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
	isYWHMember(){
		return new Promise((resolve, reject) => {
			let zone = this.utils.getUserZone()
			// 获取用户组
			request.GET(`groups`,{type:6,region_type:2,region_cc:zone.china_code}).then(res=>{
				if(res.data.length === 0) {
					resolve(false)
					return false
				}
				let groupid = res.data[0].id
				// 获取用户组成员判断用户是否在其中
				request.GET(`groups/${groupid}/users`).then(res2=>{
					let user_info = this.utils.getUser()
					for(let i in res2.data){
						if(user_info.id == res2.data[i].user_id){
							resolve(true)
							return false
						}
					}
					resolve(false)
				}).catch(err=>{
					resolve(false)
				})
			})
			
		})
	}
	// 相隔天数
	dateDiff(endata,startdata){
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
}

export default new utils;

