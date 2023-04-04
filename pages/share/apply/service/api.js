import request from "@/pages/framework/utils/request/request.js";

// 获取所有正常使用状态下的业务种类
export function getShareBusinessKind() {
	return request.GET(`share/kind-active-all`);
}
// 获取种类下的所有业务数据
export function getShareBusinessAllData(params) {
	return request.GET(`share/kind-all-biz-data`,params);
}
// 获取业务列表
export function getShareBusinessList(data) {
	return request.GET(`share/biz`, data);
}
// 获取业务所需的所有材料
export function getShareBusinessMaterial(params) {
	return request.GET(`share/biz-material`, params);
}
// 用户发起共享记录
export function postShareRecord(data) {
	return request.POST(`share/record`, data);
}
// 平台协议说明
export function getRecord() {
	return request.GET(`share/contract`);
}