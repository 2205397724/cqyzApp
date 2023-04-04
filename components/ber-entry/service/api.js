// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request2.js";


// 获取列表
export function getVoteList(data) {
	return request.GET("entry", data);
}
// 删除
export function deleteVote(entry) {
	return request.DELETE(`entry/${entry}`);
}
