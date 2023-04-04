import request from "@/pages/framework/utils/request/request.js";
export function getNewsList(status) {
	return request.GET(`news`, status)
}
export function delNewsList(id) {
	return request.DELETE(`news/${id}`)
}
// 获取咨询类别列表
export function getNewsCateList(data) {
	return request.GET(`newscate`, data)
}
