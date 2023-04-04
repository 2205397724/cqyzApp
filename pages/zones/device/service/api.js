import request from "@/pages/framework/utils/request/request.js";
// // 获取设施档案
// export function getDetail(data) {
// 	return request.GET(`d/archive`,data);
// }
// 获取设施详情
export function getDetail(id) {
	return request.GET(`device/${id}`);
}
// 获取设施档案列表
export function getArchiveList(data) {
	return request.GET(`d/archive`,data);
}
// 获取设施档案详情
export function getArchiveDetails(id) {
	return request.GET(`d/archive/${id}`)
}
// 获取设施维修记录列表
export function getRepairList(data) {
	return request.GET(`d/repair`,data);
}
// 获取设施维修记录详情
export function getRepairDetails(id) {
	return request.GET(`d/repair/`+id);
}