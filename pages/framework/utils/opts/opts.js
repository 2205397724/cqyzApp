// // 配置项
// import { getOpts, getOptVal } from '@/util/opts.js'
// const opts_all = reactive({
//     obj: {}
// })
// getOpts(['status_cert', 'other_auth']).then(res => {
//     opts_all.obj = res
// })
// ---------------------------------------------------------------------------------------
// 只能在数组后面追加值，不能在数组前面插入值
// ---------------------------------------------------------------------------------------
// 小区文件类型   			zone_file_type   
// 楼栋文件类型   			building_file_type
// 单元文件类型   			unit_file_type
// 房屋文件类型   			house_file_type
// 房屋户型   				house_type_model
// 房屋产权性质   			house_type_property
// 房屋楼栋性质   			house_type_building
// 房屋使用状态   			house_status_use
// 房屋安全状态   			house_status_safe
// 房屋规划、实际用途   		house_status_plan_fact
// 滞纳金规则计算方式   		money_overdue_rule_type_calc
// 滞纳金规则计算周期   		money_overdue_rule_type_calc_interval
// 性别   					gender
// 短信验证码发送场景       	sms_purpose
// 第三方登录类型       		login_type
// 通用处理状态       		status_all

// 用户端类型       			terminal
// 房屋住户标识       		role_house
// 分类种类       			type_type
// 步骤动作代码       		step_type
// 企业类别       			enterprise_type
// 企业服务类型       		enterprise_service
// 公示任务接收对象等级      article_lv
// 公示任务派发频率       	article_rate
// 是否绑定产权       		house_has_property
// 房屋上级类型       		houseable_type
// 产权是否绑定房屋       	house_has_house
// 审批       				process_status
// 关联对象类型       		article_type
// 任务派发是否使用       	tasksd_use
// 任务是否完成       		task_ok
// 文件资源类型       		resources_type
// 文件分类       			file_type
// 系统级别      	 		sys_is_sys
// 启用状态       			sys_is_active
// 供水方式      			build_type_water
// 结构形式       			build_type_construct
// 证件类型       			type_id_card
// 添加时候的区域等级       	china_level
// 建筑结构       			build_type_construct
// 公示状态					announce_list_status


// import api2 from "@/pages/framework/utils/request/request2.js";
import api from "@/pages/framework/utils/request/request.js";
const opts = {
	// 设备状态
	device_status: [{
	    key: 1,
	    val: '正常'
	}, {
	    key: 2,
	    val: '故障'
	}, {
	    key: 3,
	    val: '维修中'
	}],
	// 设备类型
	device_type: [{
	    key: 1,
	    val: '设备'
	}, {
	    key: 2,
	    val: '设施'
	}, {
	    key: 3,
	    val: '部位'
	}, {
	    key: 9,
	    val: '其他'
	}],
	// 投诉 状态
	repair_status:[{
		key:0,
		val:'未审核'
	},{
		key:1,
		val:'已审核'
	},{
		key:2,
		val:'已确认'
	},{
		key:3,
		val:'已受理'
	},{
		key:4,
		val:'已拒办'
	},{
		key:5,
		val:'已转办'
	},{
		key:6,
		val:'处理中'
	},{
		key:7,
		val:'已处理'
	},{
		key:99,
		val:'结案'
	}],
	// 维修类型
	repair_type: [{
	    key: 1,
	    val: '日常维护'
	}, {
	    key: 2,
	    val: '维修记录'
	}],
	// 是否显示
	device_show: [{
	    key: 0,
	    val: '隐藏'
	}, {
	    key: 1,
	    val: '显示'
	}],
	// 公示任务接收对象等级 如果修改该字段，cascaderTypeAndID组件和tasksd页面需要调整
	article_lv_search: [{
		key: 999,
		val: '全部'
	}, {
		key: 3,
		val: '区县'
	}, {
		key: 4,
		val: '街道'
	}, {
		key: 5,
		val: '社区'
	}, {
		key: 6,
		val: '小区'
	}],
	// 是否违建
	is_illegal: [{
		key:1,
		val:'违建'
	},{
		key:2,
		val:'投诉'
	},{
		key:3,
		val:'报修'
	}],
	// 投诉转办对象
	toushu_return_type:[{
		key:3,
		val:'住建'
	},{
		key:4,
		val:'街道'
	},{
		key:5,
		val:'社区'
	},{
		key:6,
		val:'业委'
	},{
		key:7,
		val:'物业'
	}],
	// 投诉 状态
	complaint_status:[{
		key:0,
		val:'未审核'
	},{
		key:1,
		val:'已审核'
	},{
		key:2,
		val:'已确认'
	},{
		key:3,
		val:'已受理'
	},{
		key:4,
		val:'已拒办'
	},{
		key:5,
		val:'已转办'
	},{
		key:6,
		val:'已回复'
	},{
		key:7,
		val:'已办结'
	},{
		key:8,
		val:'追问'
	},{
		key:99,
		val:'结案'
	}],
	// 点赞，点踩
	zan_cai:[{
		key:1,
		val:'赞'
	},{
		key:0,
		val:'踩'
	}],
	// 报名是否有效
	entry_valid:[{
		key:1,
		val:'有效'
	},{
		key:2,
		val:'无效'
	}],
	// 报名参与分类
	user_wuye:[{
		key:1,
		val:'用户参与'
	},{
		key:2,
		val:'企业参与'
	}],
	// 投票
	vote_toupiao:[{
		key:1,
		val:'支持'
	},{
		key:2,
		val:'弃权'
	},{
		key:3,
		val:'反对'
	}],
	// 表决
	vote_or_biaojue:[{
		key:1,
		val:'投票'
	},{
		key:2,
		val:'表决'
	}],
	// 投票状态
	vote_status:[{
		key:1,
		val:'未开始'
	},{
		key:2,
		val:'进行中'
	},{
		key:3,
		val:'已结束'
	}],
	// 投票参与类型
	vote_type: [{
		key:0,
		val:'不关联'
	},{
		key:1,
		val:'用户参与'
	},{
		key:2,
		val:'企业参与'
	}],
	// 步骤里面的内置议题类型？死的 10 公示、21投票、22表决、20多个投票表决组、30报名
	step_yt_type: [{
	    key: 0,
	    val: '无'
	}, {
	    key: 10,
	    val: '发布公示'
	}, {
	    key: 21,
	    val: '投票'
	}, {
	    key: 22,
	    val: '表决'
	}, {
	    key: 20,
	    val: '多个投票表决组'
	}, {
	    key: 30,
	    val: '报名'
	}],
	// 流程部门 
	flowwork_type:[{
		key: 10,
		val: '按部门'
	},{
		key: 20,
		val: '按类别'
	},{
		key: 30,
		val: '按时间'
	}],
	// 流程状态
	flowwork_list_status:[{
		key: 10,
		val: '未开始'
	},{
		key: 20,
		val: '进行中'
	},{
		key: 30,
		val: '已结束'
	}],
	// 流程启用禁止
	flowwork_active: [{
		key: 1,
		val: '启用'
	}, {
		key: 0,
		val: '禁用'
	}],
	// 性别
	gender: [{
		key: 'U',
		val: '未设置'
	}, {
		key: 'M',
		val: '男'
	}, {
		key: 'F',
		val: '女'
	}],
	// 短信验证码发送场景
	sms_purpose: [{
		key: 'default',
		val: '默认'
	}, {
		key: 'login',
		val: '登录'
	}, {
		key: 'modify',
		val: '修改手机号'
	}],
	// 第三方登录类型
	login_type: [{
		key: 100,
		val: '微信'
	}, {
		key: 200,
		val: 'QQ'
	}, {
		key: 300,
		val: '支付宝账号'
	}, {
		key: 400,
		val: '苹果账号'
	}],
	// 通用处理状态
	status_all: [{
		key: 10,
		val: '未处理'
	}, {
		key: 15,
		val: '处理中'
	}, {
		key: 20,
		val: '处理成功'
	}, {
		key: 30,
		val: '处理失败'
	}],
	// 实名认证状态
	status_cert: [{
		key: 10,
		val: '未认证'
	}, {
		key: 15,
		val: '认证中'
	}, {
		key: 20,
		val: '认证成功'
	}, {
		key: 30,
		val: '认证失败'
	}],
	// 用户端类型
	terminal: [{
		key: 'pt',
		val: '总平台管理端'
	}, {
		key: 'ptr',
		val: '区域平台管理端'
	}, {
		key: 'mbr',
		val: '业主端'
	}, {
		key: 'pm',
		val: '物业端'
	}, {
		key: 'gov',
		val: '行政管理端'
	}],
	// 房屋住户标识
	role_house: [{
		key: 1,
		val: '业主'
	}, {
		key: 0,
		val: '非业主'
	}],
	// 分类种类
	type_type: [{
		// key: 101,
		key: 'announce',
		val: '公示'
	}],
	// 步骤动作代码
	step_type: [{
		key: 101,
		val: '公示审核'
	}],
	// 企业类别
	enterprise_type: [{
		key: 1,
		val: '物业'
	}],
	// 企业服务类型
	enterprise_service: [{
		key: 100,
		val: '物业'
	}],
	// 公示任务接收对象等级 如果修改该字段，cascaderTypeAndID组件和tasksd页面需要调整
	article_lv: [{
		key: 3,
		val: '区县'
	}, {
		key: 4,
		val: '街道'
	}, {
		key: 5,
		val: '社区'
	}, {
		key: 6,
		val: '小区'
	}],
	// 公示任务派发频率
	article_rate: [{
		key: 1,
		val: '每月'
	}, {
		key: 2,
		val: '每季度'
	}, {
		key: 3,
		val: '每半年'
	}, {
		key: 4,
		val: '每年'
	}],
	// 是否绑定产权
	house_has_property: [{
		key: 1,
		val: '已绑定'
	}, {
		key: 0,
		val: '未绑定'
	}],
	// 房屋上级类型
	houseable_type: [{
		key: 'buildings',
		val: '楼栋'
	}, {
		key: 'units',
		val: '单元'
	}],
	// 产权是否绑定房屋
	house_has_house: [{
		key: 1,
		val: '已绑定'
	}, {
		key: 0,
		val: '未绑定'
	}],
	// 审批
	process_status: [{
		key: 200,
		val: '拒绝'
	}, {
		key: 300,
		val: '同意'
	}],
	// 关联对象类型
	article_type: [{
		key: 0,
		val: '无'
	}],
	// 任务派发是否使用
	tasksd_use: [{
		key: 0,
		val: '不启用'
	}, {
		key: 1,
		val: '启用'
	}],
	// 任务是否完成
	task_ok: [{
		key: 0,
		val: '未完成'
	}, {
		key: 1,
		val: '已完成'
	}],
	// 文件资源类型
	resources_type: [{
		key: 100,
		val: '资源类型一'
	}, {
		key: 200,
		val: '资源类型二'
	}],
	// 文件分类
	file_type: [{
		key: 100,
		val: '文件分类一'
	}, {
		key: 200,
		val: '文件分类二'
	}],
	// 系统级别
	sys_is_sys: [{
		key: 0,
		val: '关闭'
	}, {
		key: 1,
		val: '开启'
	}],
	// 启用状态
	sys_is_active: [{
		key: 0,
		val: '关闭'
	}, {
		key: 1,
		val: '开启'
	}],
	// 供水方式
	build_type_water: [{
		key: 100,
		val: '供水方式一'
	}],
	// 证件类型
	type_id_card: [{
		key: 1,
		val: '证件类型一'
	}],
	// china添加时候的区域等级
	china_level: [{
		key: 100,
		val: '区域等级一'
	}],
	// 建筑结构
	build_type_construct: [{
		key: 100,
		val: '砖混'
	}],
	// 房屋申请记录审核状态
	house_bind_status: [{
		key: 0,
		val: '待审核'
	},{
		key: 1,
		val: '已通过'
	},{
		key: 2,
		val: '已拒绝'
	}],
	// 公示状态
	announce_list_status:[{
		key: 4,
		val: '公示中'
	},{
		key: 3,
		val: '未开始'
	},{
		key: 7,
		val: '已结束'
	}]
}

export async function getOpts(arr) {
	// const res = await api2.POST('optitem', {
	// 	lab: arr
	// })
	const res = await api.POST('optitem', {
		lab: arr
	})
	const opt_up = {}
	for (let key in res.data) {
		opt_up[key] = res.data[key]
		if (res.data[key].length <= 0 && opts[key]) {
			opt_up[key] = opts[key]
		}
	}
	return opt_up
}
export function getOptVal(arr, key) {
	for (let i in arr) {
		if (arr[i].key == key) {
			return arr[i].val
		}
	}
	return ''
}
