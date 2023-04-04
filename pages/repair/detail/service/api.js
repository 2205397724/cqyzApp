import request from "@/pages/framework/utils/request/request.js";

// 获取投诉详情
export function getDetails(complaint,data) {
	return request.GET(`complaint/${complaint}`, data)
}
// 追问
export function postComplaintPlus(id,data) {
	return request.POST(`complaint/${id}/plus`, data)
}

