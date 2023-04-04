// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";


// 点赞详情
export function getZanCaiList(data) {
	return request.GET(`entrymbrzan`,data);
}
// 我要报名
export function postAdd(data) {
	return request.POST(`entrymbrzan`,data);
}
// 我要报名
export function delCai(entrymbrzan,data) {
	return request.DELETE(`entrymbrzan/${entrymbrzan}`);
}

// 我要报名
export function postEntryUserAdd(data) {
	return request.POST(`entrymbr`,data);
}
// 报名详情
export function getEntryDetails(entry, data) {
	return request.GET(`entry/${entry}`,data);
}
// 报名人员列表
export function getEntryUserList (data) {
	return request.GET(`entrymbr`,data);
}




















