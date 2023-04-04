import request from "@/pages/framework/utils/request/request.js";

// 发起投诉
export function postAdd(data) {
	return request.POST(`complaint`, data)
}

