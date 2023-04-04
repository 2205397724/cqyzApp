import request from "@/pages/framework/utils/request/request.js";

// 获取活动结果统计
export function getResultCount(survey) {
	return request.GET(`s/${survey}/stat`)
}
// 获取问卷题目
export function getSurveyTopic(data) {
	return request.GET(`s/topic`,data)
}
// 获取未参与答卷的房屋
export function getNotParticipate(survey) {
	return request.GET(`s/${survey}/doesnt`)
}
// 获取已经参与的房屋
export function getParticipate(survey){
	return request.GET(`s/answer-house/${survey}`)
}


