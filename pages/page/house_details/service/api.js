import request from "@/pages/framework/utils/request/request.js";

// 添加用户
export function getScan(hid,data) {
    return request.POST(`mbr/house/${hid}/user`,data);
}
// 获取房屋详情
export function getHouseDetails(id) {
	return request.GET(`houses/${id}`);
}
// 获取房屋成员
export function getHouseUser(data) {
	return request.GET("house-user", data);
}
// 添加房屋成员
export function postHouseUser(data) {
	return request.POST("house-user", data);
}
// 删除房屋成员
export function deleteHouseUser(data) {
	return request.DELETE("house-user", data);
}
//获取产权列表
export function getHouseProperty(data) {
	return request.GET(`house-property`,data)
}
//根据产权ID获取详情
export function getPropertyDetail(id) {
	return request.GET(`house-property/${id}`)
}
// 获取人员列表
export function getPeopleList(data) {
	return request.GET(`people`, data);
}
// 添加人员信息
export function addPeople(data) {
	return request.POST(`people`, data);
}