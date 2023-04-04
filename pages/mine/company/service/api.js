// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 获取用户的认证列表
export function getComCert(data) {
	return request.GET(`me/com-cert`,data);
}


