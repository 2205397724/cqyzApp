import request from "@/pages/framework/utils/request/request.js";

//获取用户组业委会
export function getGroupList(data) {
	return request.GET(`groups`,data);
}
export function getGroupDetail(id) {
	return request.GET(`groups/${id}`);
}
//获取用户组成员
export function getGroupMember(id) {
	return request.GET(`groups/${id}/users`);
}
// 获取企业详情
export function getCompanyDetail(id) {
	return request.GET(`com/${id}`);
}
// 获取备案
export function getFilingList(data) {
	return request.GET(`filing`,data);
}