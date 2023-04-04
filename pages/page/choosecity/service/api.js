import request from "@/pages/framework/utils/request/request.js";
// import request2 from "@/pages/framework/utils/request/request2.js";

// 获取城市
export function getCity(data) {
	// return request1.GET("city-config", data);
	return request.GET("srv-city", data);
}