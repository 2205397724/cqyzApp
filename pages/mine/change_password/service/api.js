import request from "@/pages/framework/utils/request/request.js";

// 修改用户密码
// export function putPassword(data) {
// 	return request.PUT(`user/password`,data);
// }
export function putPassword(user,data) {
	return request.PUT(`user/${user}/account`,data);
}