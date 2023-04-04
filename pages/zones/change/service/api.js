import request from "@/pages/framework/utils/request/request.js";

// 发起活动
export function postActivity(data) {
	return request.POST(`survey`,data);
}
// 发起审核
export function postAudit(data) {
	return request.POST(`a-audit`, data);
}