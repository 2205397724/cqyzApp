import request from "@/pages/framework/utils/request/request.js";

// 上传企业认证
export function postComCert(data) {
	return request.POST(`me/com-cert`,data);
}

// 获取用户的认证列表
export function getComCert(data) {
	return request.GET(`me/com-cert`,data);
}


