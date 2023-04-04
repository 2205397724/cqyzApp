import request from "@/pages/framework/utils/request/request.js";

// 获取违建列表
export function getList(data) {
	return request.GET(`complaint`, data)
}

