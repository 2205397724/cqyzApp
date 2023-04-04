import Vue from 'vue'
import {
	HTTP_REQUEST_URL,
	HEADER,
} from '@/pages/framework/config/app.js';
import Cache from '@/pages/framework/utils/cache/cache.js'
import {
	REGION
} from '@/pages/framework/config/cache.js'

/**
 * 发送请求
 */
function baseRequest(url, method, data, login) {
	let header = {...HEADER}
	header['X-Sign'] = Vue.prototype.utils.getSign()
	// 区域代码，获取小区、楼栋、单元、房屋、以及与以上相关的业务时需要
	header['X-Cc'] = Vue.prototype.utils.getUserCity().china_code
	// console.log(Cache.get(REGION).china_code)
	if(!login){
		let token = Vue.prototype.utils.getToken()
		if(!token){
			uni.showToast({
				icon:'none',
				title:'登录验证失效，请重新登录！'
			})
			setTimeout(()=>{
				uni.reLaunch({
					url: '/pages/page/login/login'
				});
			},1000)
			return new Promise((reslove, reject) => {reject('无token')})
		}
		header.Authorization += token
	}
	return new Promise((reslove, reject) => {
		
		uni.request({
			url: HTTP_REQUEST_URL + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				// uni.hideToast()
				if(res.statusCode!==200){
					uni.showToast({
						icon:'none',
						title: res.data.message||`错误代码：${res.statusCode}`
						// title: "请选择地区"
					})
					reject(res);
				}
				reslove(res)
			},
			fail: (err) => {
				uni.showToast({
					icon: 'none',
					title: err.errMsg
				})
				setTimeout(()=>{
					reject(err);
				},1000)
			}
		})
	});
}

const request = {};

['OPTIONS', 'GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'TRACE', 'CONNECT'].forEach((method) => {
	request[method] = (api, data, login) => baseRequest(api, method, data, login)
});



export default request;
