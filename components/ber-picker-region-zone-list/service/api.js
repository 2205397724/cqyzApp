// import request1 from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";
import request from "@/pages/framework/utils/request/request.js";

// 获取城市区域级别
export function getCity(code) {
	// return request1.GET("china", {'p_code':code});
	return request.GET("china", {'p_code':code});
}
// 列表
export function getList(data) {
    // return request2.GET('zones', data)
	return request.GET('zones', data)
}


