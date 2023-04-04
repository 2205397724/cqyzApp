import request from "@/pages/framework/utils/request/request.js";

// 活动列表
// export function getSurveyList(data) {
// 	return request.GET(`survey`, data);
// }
export function getSurveyList(data) {
	return request.GET(`mbr/survey`, data);
}
// 事件(议事专题)列表
export function getVeinList(data) {
	return request.GET(`vein`, data);
}