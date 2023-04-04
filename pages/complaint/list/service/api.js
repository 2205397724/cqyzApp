import request from "@/pages/framework/utils/request/request.js";

export function getList(data) {
	return request.GET(`complaint`, data)
}

