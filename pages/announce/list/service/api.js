import request from "@/pages/framework/utils/request/request.js";

// 获取用户所在用户组
export function getGroupList() {
	return request.GET(`me/groups`)
}
// 获取公示列表
export function getAnnounceList(data) {
	return request.GET(`announce`,data);
}
