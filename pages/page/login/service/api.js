import request from "@/pages/framework/utils/request/request.js";

// 用户信息
export function getUserInfo() {
	// return request.GET("user/me");
	return request.GET("me");
}

// 一键登录
export function postLoginOther(data) {
	// return request.POST("user/third-oauth-login", data, true);
	return request.POST("third-oauth-login", data, true);
}

// 一键登录
export function postLoginOne(data) {
	// return request.POST("user/uni-verify-login", data, true);
	return request.POST("uni-verify-login", data, true);
}
// 密码登录
export function postLoginLocal(data) {
	// return request.POST("user/local-login", data, true);
	return request.POST("local-login", data, true);
}
// 短信登录
export function postLoginSMS(data) {
	// return request.POST("user/mobile-login", data, true);
	return request.POST("mobile-login", data, true);
}
// 发送短信
export function postCode(data) {
	return request.POST("sms-code", data, true);
}
//绑定用户CID
export function putClientid(data){
	return request.PUT("me/cid",data)
}