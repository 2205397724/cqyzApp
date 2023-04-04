import request from "@/pages/framework/utils/request/request.js";

export function getReadLog(data) {
	return request.GET("visitlog",data);
}
