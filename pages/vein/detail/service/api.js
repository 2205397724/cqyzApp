import request from "@/pages/framework/utils/request/request.js";

// 事件(议事专题)详情
export function getVeinDetail(id) {
	return request.GET(`vein/${id}`);
}
// 获取事件下的所有活动
export function getVeinActivityList(vein) {
	return request.GET(`vein/${vein}/docs`);
}
