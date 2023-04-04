import request from "@/pages/framework/utils/request/request.js";

// 提交绑定房屋申请
export function postHouseApply(data) {
	return request.POST("house-bind", data);
}
// 修改绑定房屋申请
export function putHouseApply(id,data) {
	return request.PUT(`house-bind/${id}`, data);
}