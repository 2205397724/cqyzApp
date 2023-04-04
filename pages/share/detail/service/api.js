import request from "@/pages/framework/utils/request/request.js";

// 获取用户发起的共享记录详情
export function getShareRecordDetail(id) {
	return request.GET(`share/record/${id}`);
}
// 用户停止共享记录
export function stopShareRecord(id) {
	return request.PUT(`share/record-off/${id}`);
}
// 补充材料信息
export function putShareRecordMaterial(id,data) {
	return request.PUT(`share/record-material/${id}`,data);
}
//获取下载记录
export function getShareRecordDownloadList(data) {
	return request.GET(`share/record-dl`,data);
}