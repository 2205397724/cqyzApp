// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 房屋详情 /api/houses/{id}
export function getHouseDetails(id, data) {
	return request.GET(`houses/${id}`,data);
}
// 获取选项详情
export function getVoteOptDetails(voteopt, data) {
	return request.GET(`voteopt/${voteopt}`,data);
}
// 用户投票详情
export function getUserVoteDetails(vote, data) {
	return request.GET(`mbr/vote/${vote}/ticket`,data);
}

// 用户投票
export function postUserVote(vote, data) {
	return request.POST(`mbr/vote/${vote}/ticket`,data);
}

// 获取选项列表
export function getVoteOptList(data) {
	return request.GET(`voteopt`,data);
}
// 获取详情
export function getVoteDetails(vote, data) {
	return request.GET(`vote/${vote}`,data);
}

