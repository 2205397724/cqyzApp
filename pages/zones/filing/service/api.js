import request from "@/pages/framework/utils/request/request.js";
export function getDetails(id) {
	return request.GET(`filing/${id}`);
}
export function getGroupList() {
	return request.GET(`groups`)
}
export function getFilingKind(kind) {
	return request.GET(`kind/${kind}/cat`)
}
