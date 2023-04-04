// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";
// 添加事件
export function postVote(data) {
	return request.POST(`entry`,data);
}
// 获取详情
export function getVoteDetails(entry, data) {
	return request.GET(`entry/${entry}`,data);
}
// 添加事件
export function putVote(entry,data) {
	return request.PUT(`entry/${entry}`,data);
}

