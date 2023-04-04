// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

export function putUserInfo(data) {
	// return request.PUT(`user/cert`,data);
	return request.PUT(`me/sfz-cert`,data);
}
// 用户信息
export function getUserInfo() {
	// return request.GET("user/me");
	return request.GET("me");
}
