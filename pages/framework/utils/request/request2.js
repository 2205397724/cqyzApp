
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
	header['X-Sign'] = this.utils.getSING()
	if(!login){
		let token = this.utils.getToken()
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
		// let HTTP_REQUEST_URL2 = Cache.get(REGION).base_url+'/api/'
		// let HTTP_REQUEST_URL = Cache.get(REGION).base_url+'/api/'//没有base_url属性
		if(!Cache.get(REGION)){
			uni.showToast({
				icon:'none',
				title:'请选择区域！'
			})
			reject('请选择区域！')
			return false
		}
		uni.showToast({
			mask: true,
			duration: 10000,
			icon: 'loading',
			title: '加载中...'
		})
		uni.request({
			// url: HTTP_REQUEST_URL2 + url,
			url: HTTP_REQUEST_URL + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {	
				uni.hideToast()
				if(res.statusCode!==200){
					uni.showToast({
						icon:'none',
						title: res.data.msg||`错误代码：${res.statusCode}`
					})
					// setTimeout(()=>{
					// 	reject(res.data.code?res.data:res.statusCode);
					// },1000)
					return false
				}
				// reslove(res.data);
				reslove(res);
			},
			fail: (err) => {
				uni.showToast({
					icon: 'none',
					title: err
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
