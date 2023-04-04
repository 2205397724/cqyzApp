import request from "@/pages/framework/utils/request/request.js";

// 获取房屋详情
export function getHouseDetails(id) {
	return request.GET(`houses/${id}`);
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
// 获取设施设备
export function getDevice(data) {
	return request.GET(`device`,data);
}
// 获取备案
export function getFilingList(data) {
	return request.GET(`filing`,data);
}