// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";
// 申请列表
export function getHouseApplyList(data) {
	return request.GET("house-bind", data);
}
// 申请详情
export function getHouseApplyDetails(id) {
	return request.GET(`house-bind/${id}`);
}
// 申请删除
export function deleteHouseApply(id) {
	return request.DELETE(`house-bind/${id}`);
}











