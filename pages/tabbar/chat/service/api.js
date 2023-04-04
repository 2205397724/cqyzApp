import request from "@/pages/framework/utils/request/request.js";

export function getMessageList(data) {
	return request.GET(`me/notice`, data);
}