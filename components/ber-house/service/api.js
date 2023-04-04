// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 获取城市区域级别
export function getCity(code) {
	// return request2.GET("china", {'p_code':code});
	return request.GET("china", {'p_code':code});
}
// 取消参与的房屋
export function deleteJoinHouse(vote, data) {
	return request.DELETE(`vote/${vote}/ticket`,data);
}
// 获取房屋列表
export function getHouseList(vote, data) {
	return request.GET(`vote/${vote}/house`,data);
}
// 获取zone
export function getZoneDetails(id, data) {
	return request.GET(`zones/${id}`,data);
}

export function APIgetResidentialListHouse(params) {
    return request.GET('zones', params)
}
export function APIgetBuildListHouse(params) {
    return request.GET('buildings', params)
}
export function APIgetUnitsListHouse(params) {
    return request.GET('units', params)
}
// 获取房屋列表
export function getRCHouseList(vote, data) {
	return request.GET(`vote/${vote}/house`,data);
}
// 获取房屋
export function getHouse(data) {
	return request.GET(`houses-able`,data);
}
// 修改房屋
export function putVoteHouseDA(vote,data) {
	return request.PUT(`vote/${vote}/house`,data);
}
// 参与的房屋
export function postJoinHouse(vote, data) {
	return request.POST(`vote/${vote}/house`,data);
}





