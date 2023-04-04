import request from "@/pages/framework/utils/request/request.js";

// 评论列表
// export function getList(tgtid, data) {
// 	return request.GET(`target/${tgtid}/comment`, data);
// }
export function getList(data) {
	return request.GET(`comment`, data);
}
// 发布评论
export function postComment(tgtid, data) {
	return request.POST(`target/${tgtid}/comment`, data);
}
//评论设置
export function getComment(tgtid, data) {
	return request.GET(`commentcfg/${tgtid}`, data);
}
// 修改评论
export function modifyComment(tgtid, data) {
	return request.PUT(`comment/${tgtid}`, data);
}
// 点赞
export function postCommentZan(tgtid) {
	return request.POST(`comment-zan/${tgtid}`);
}
//取消赞
export function delCommentZan(tgtid) {
	return request.DELETE(`comment-zan/${tgtid}`);
}
// 点踩
export function postCommentCai(tgtid) {
	return request.POST(`comment-cai/${tgtid}`);
}
//取消踩
export function delCommentCai(tgtid) {
	return request.DELETE(`comment-cai/${tgtid}`);
}