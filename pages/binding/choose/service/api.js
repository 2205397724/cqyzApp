// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 绑定选中房屋
export function postBindCheckHouse(data) {
	return request.POST("mbr/house-bind-check", data);
}
// 选中房屋
export function postCheckHouse(data) {
	return request.POST("mbr/house-check", data);
}
// 取消选中房屋
export function postUncheckHouse(data) {
	return request.POST("mbr/house-uncheck", data);
}
// 绑定房屋s
export function postBindHouse(data) {
	return request.POST("mbr/house-bind", data);
}
// 获取城市区域级别
export function getCity(code) {
	return request.GET("china", {'p_code':code});
}
// 获取小区
export function getZone(data) {
	return request.GET("zones", data);
}
// 获取楼栋
export function getBuilding(data) {
	return request.GET("buildings", data);
}
// 获取单元
export function getUnit(data) {
	return request.GET("units", data);
}
// 获取房屋
export function getHouse(data) {
	return request.GET("houses-able", data);
}
// 获取已绑定房屋
export function getBindHouse(data) {
	return request.GET("houseme", data);
}
// 获取房屋成员
export function getHouseUser(data) {
	return request.GET("house-user", data);
}
// 添加房屋成员
export function postHouseUser(data) {
	return request.POST("house-user", data);
}
// 删除房屋成员
export function deleteHouseUser(data) {
	return request.DELETE("house-user", data);
}