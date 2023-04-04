import request from "@/pages/framework/utils/request/request.js";


// 流程列表
export function getFlowworkList(data) {
	return request.GET("flowwork", data);
}
// 发起公示
export function addAnnounce(data) {
    return request.POST('announce', data)
}
// 获取分类
export function getTypeList(kind, data) {
	return request.GET(`kind/${kind}/cat`, data);
}