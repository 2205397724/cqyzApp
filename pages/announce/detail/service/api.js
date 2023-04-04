import request from "@/pages/framework/utils/request/request.js";


// 获取详情
export function getDetails(id) {
	return request.GET(`announce/${id}`);
}
// 获取列表
export function getList(data) {
	return request.GET(`announce`,data);
}
