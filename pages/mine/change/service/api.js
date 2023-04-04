import request from "@/pages/framework/utils/request/request.js";

// 修改用户账户信息
export function putUserInfo(user,data) {
	return request.PUT(`user/${user}/account`,data);
}
// 修改用户个人信息（头像昵称）
export function putCustomInfo(data) {
	return request.PUT(`me/custom`,data);
}
export function getUserInfo() {
	return request.GET("me");
}