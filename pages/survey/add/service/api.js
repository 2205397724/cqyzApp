// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 发起流程
export function postFlow(flow,data) {
	return request.POST(`flow/${flow}/work`,data);
}

// 获取流程选项
export function getFlowList(data) {
	return request.GET(`v2/flow`,data);
}
// 获取小区
export function getZone(data) {
	return request.GET("zones", data);
}
