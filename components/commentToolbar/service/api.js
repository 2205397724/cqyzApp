import request from "@/pages/framework/utils/request/request.js";

export function getList(data) {
	return request.GET(`comment`, data);
}
export function postComment(tgtid, data) {
	return request.POST(`target/${tgtid}/comment`, data);
}
export function getCommentCfg(tgtid, data) {
	return request.GET(`commentcfg/${tgtid}`, data);
}
