import request from "@/pages/framework/utils/request/request.js";

// 获取活动（问卷等）详情
export function getSurveyDetails(id) {
	return request.GET(`survey/`+id);
}
// 获取问卷参与范围
export function getSurveyRange(data) {
	return request.GET(`s/can/`,data);
}
// 获取活动审核列表
export function getAuditList(data) {
	return request.GET(`a-audit`,data);
}
// 获取活动结果统计
export function getResultCount(survey) {
	return request.GET(`s/${survey}/stat`)
}
// 获取问卷题目
export function getSurveyTopic(data) {
	return request.GET(`s/topic`,data)
}
//线上参与答卷
export function postSurveyAnswer(survey,data) {
	return request.POST(`s/${survey}/answer-online`,data)
}
// 获取业主参与的答卷
export function getUserAnswer(survey) {
	return request.GET(`s/${survey}/me-answer`)
}