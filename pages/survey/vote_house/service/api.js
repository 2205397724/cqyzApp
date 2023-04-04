// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";
// 获取房屋列表
export function getHouseList(vote, data) {
	return request.GET(`vote/${vote}/house`,data);
}
// 获取楼栋
export function getBuilding(data) {
	return request.GET(`buildings`,data);
}
// 获取单元
export function getUnit(data) {
	return request.GET(`units`,data);
}
// 获取房屋
export function getHouse(data) {
	return request.GET(`houses-able`,data);
}
// 获取小区详情
export function getZoneDetails(id) {
	return request.GET(`zones/${id}`);
}
