import request from "@/pages/framework/utils/request/request.js";

// 修改用户信息
// export function putPhone(data) {
// 	return request.PUT(`user/mobile`,data);
// }
// 修改手机号
export function putPhone(user,data) {
	return request.PUT(`user/${user}/account`,data);
}
// 发送短信
export function postCode(data) {
	return request.POST("sms-code", data, true);
}
// 用户信息
// export function getUserInfo() {
// 	return request.GET("user/me");
// }
export function getUserInfo() {
	return request.GET("me");
}