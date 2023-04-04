import request from "@/pages/framework/utils/request/request.js";

// 获取房屋详情
export function getHouseDetail(id) {
	return request.GET(`houses/${id}`);
}
// 获取房屋 个人
export function getHouseMe(data) {
	return request.GET("houseme", data);
}
// 获取房屋 企业
export function getHouseCom(data) {
	return request.GET("housecom", data);
}
// 获取我的小区 个人
export function getZoneMe(data) {
	return request.GET("zoneme", data);
}
// 获取我的小区 企业
export function getZoneCom(data) {
	return request.GET("zonecom", data);
}
// 获取个人企业列表
export function getCompanyList() {
	return request.GET("me/com-cert")
}