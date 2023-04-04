import request from "@/pages/framework/utils/request/request.js";

export function getMessageDetail(notice) {
	return request.GET(`me/notice/${notice}`)
}
export function getMessageList(data) {
	return request.GET(`me/notice`, data);
}