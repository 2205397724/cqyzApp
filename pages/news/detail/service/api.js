import request from "@/pages/framework/utils/request/request.js";
export function getNewsDetail(id) {
	return request.GET(`news/${id}`)
}
export function getZoneDetail(id) {
	return request.GET(`zones/${id}`)
}
