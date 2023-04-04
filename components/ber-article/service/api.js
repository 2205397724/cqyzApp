// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";
// 获取房屋详情
export function getAnnounceList(data) {
	return request.GET(`a/article`,data);
}
