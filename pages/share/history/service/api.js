import request from "@/pages/framework/utils/request/request.js";

// 获取用户发起的共享记录列表
export function getShareRecord(data) {
	return request.GET(`share/record`, data);
}
// 用户停止共享记录
export function stopShareRecord(id) {
	return request.PUT(`share/record-off/${id}`);
}