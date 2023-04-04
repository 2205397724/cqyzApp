import request from "@/pages/framework/utils/request/request.js";
// 获取用户组列表
export function getGroupList(data) {
	return request.GET(`groups`,data)
}
export function getUpstream(data) {
	return request.POST(`group-upstream`,data)
}
//获取详情
export function getGroupDetail(group){
	return request.GET(`groups/${group}`)
}