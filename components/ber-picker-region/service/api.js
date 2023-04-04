import request from "@/pages/framework/utils/request/request.js";

// 获取城市区域级别
export function getCity(code) {
	return request.GET("china", {'p_code':code});
}
