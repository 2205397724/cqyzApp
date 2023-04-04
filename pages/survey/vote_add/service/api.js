// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";
// 修改房屋
export function putVoteHouseDA(vote,data) {
	return request.PUT(`vote/${vote}/house`,data);
}

// 详情选项
export function deleteOpts(voteopt,data) {
	return request.DELETE(`voteopt/${voteopt}`,data);
}

// 详情选项
export function putVoteOpt(voteopt,data) {
	return request.PUT(`voteopt/${voteopt}`,data);
}
// 详情选项
export function getVoteOptDetails(voteopt,data) {
	return request.GET(`voteopt/${voteopt}`,data);
}
// 添加选项列表
export function postVoteOpt(data) {
	return request.POST(`voteopt`,data);
}
// 获取选项列表
export function getVoteOptList(data) {
	return request.GET(`voteopt`,data);
}
// 获取房屋列表
export function getHouseList(vote, data) {
	return request.GET(`vote/${vote}/house`,data);
}
// 取消参与的房屋
export function deleteJoinHouse(vote, data) {
	return request.DELETE(`vote/${vote}/ticket`,data);
}
// 参与的房屋
export function postJoinHouse(vote, data) {
	return request.POST(`vote/${vote}/house`,data);
}
// 修改事件
export function putVote(vote, data) {
	return request.PUT(`vote/${vote}`,data);
}
// 添加事件
export function postVote(data) {
	return request.POST(`vote`,data);
}
// 获取详情
export function getVoteDetails(vote, data) {
	return request.GET(`vote/${vote}`,data);
}


