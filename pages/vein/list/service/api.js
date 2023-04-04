import request from "@/pages/framework/utils/request/request.js";

// 事件(议事专题)列表
export function getVeinList(data) {
	return request.GET(`vein`, data);
}