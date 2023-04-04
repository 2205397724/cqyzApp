import request from "@/pages/framework/utils/request/request.js";

// 获取用户信息
export function getUserMessage() {
	return request.GET("me")
}
// 获取个人企业列表
export function getCompanyList() {
	return request.GET("me/com-cert")
}