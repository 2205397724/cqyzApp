import request from "@/pages/framework/utils/request/request.js";
// 删除用户账户
export function deleteUser(authType,user) {
	return request.DELETE(`account/${authType}/${user}`);
}