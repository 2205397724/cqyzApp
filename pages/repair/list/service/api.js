// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 获取公示详情
export function getList(data) {
	return request.GET(`complaint`, data)
}

