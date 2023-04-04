import request from "@/pages/framework/utils/request/request.js";

// 获取所在用户组
export function getGroupList() {
	return request.GET(`me/groups`);
}
// 获取公示任务列表
export function getAnnounceTaskList(data) {
	return request.GET(`a/task`,data);
}
// 获取公示任务详情
export function getAnnounceTaskDetail(id) {
	return request.GET(`a/task/${id}`);
}
// 获取用户组详情
export function getGroupDetail(group) {
	return request.GET(`groups/${group}`);
}
