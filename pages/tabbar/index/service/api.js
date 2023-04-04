import request from "@/pages/framework/utils/request/request.js";

// 获取小区列表
export function getZoneMe(data) {
	// return request2.GET("zones", data);
	return request.GET("zoneme", data);
}
// 获取消息列表
export function getMessageList(data) {
	// return request2.GET(`me/notice`, data);
	return request.GET(`me/notice`, data);
}
// 议事列表
export function getSurveyList(data) {
	return request.GET(`mbr/survey`, data);
}
// 获取公示列表
export function getAnnounceList(data) {
	return request.GET(`announce`,data);
}
// 获取公示分类
export function getAnnounceKind(kind) {
	return request.GET(`kind/${kind}/cat`);
}
export function getUserGroup() {
	return request.GET("me/groups")
}
export function getZoneCom(data) {
	return request.GET("zonecom",data)
}