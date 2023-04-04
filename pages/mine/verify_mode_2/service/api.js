// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 实名认证
export function putIdCart(data) {
	// return request.PUT(`user/cert`,data);
	return request.PUT(`me/cert`,data);
}
// 获取实名状态
export function getReady(data) {
	// return request.GET(`user/cert`,data);
	return request.GET(`me/cert`,data);
}
// 用户信息
export function getUserInfo() {
	// return request.GET("user/me");
	return request.GET("me");
}