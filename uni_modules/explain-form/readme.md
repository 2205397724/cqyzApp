# EXPLAIN-FORM

explain-form 是一个低代码表单框架，它使用 JSON 配置来生成页面，可以减少页面开发工作量，极大提升效率。

设计思路来源于 [amis](https://baidu.gitee.io/amis/zh-CN/docs/index) 框架，表单组件基于uni-ui。

加入QQ群：[970799055](https://jq.qq.com/?_wv=1027&k=KFkDL5gp)。

### 使用方法
一个最简单的配置看起来是这样的：
```javascript
{
	"controls": [
		{
			"type": "text",
			"name": "name",
			"label": "姓名"
		}
	]
}
```

请观察上面的代码，这是一段 JSON，它的含义是：

`controls` 表示表单中包含的控件，每个控件中 `type` 是节点中最重要的字段，它告诉 `explain-form` 当前节点需要渲染的是 `text` 组件，`name` 为控件所对应的属性名称。
组件节点的配置永远都是由 `type` 字段 （用于标识当前是哪个组件）和属性构成的。

### 示例
```html
<template>
	<view class="uni-container">
		<explain-form v-model="formSchema" @submit="onSubmit"></explain-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formSchema: null
			}
		},
		onLoad() {
			this.formSchema = {
				// 通过替换下面这个配置来生成不同页面
				"controls": [{
						"type": "text",
						"name": "student_name",
						"label": "学生姓名",
						"required": true,
						"placeholder": "请输入学生姓名",
						"rules": [{
								"required": true,
								"errorMessage": "请输入学生姓名"
							},
							{
								"minLength": 2,
								"maxLength": 5,
								"errorMessage": "学生姓名长度在 {minLength} 到 {maxLength} 个字符"
							}
						]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_gender",
						"label": "学生性别",
						"required": true,
						"options": [{
								"text": "男",
								"value": "0"
							},
							{
								"text": "女",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择学生性别"
						}]
					},
					{
						"type": "text",
						"name": "student_id_number",
						"label": "学生身份证号码",
						"required": true,
						"placeholder": "请输入学生身份证号码",
						"rules": [{
								"required": true,
								"errorMessage": "请输入学生身份证号码"
							},
							{
								"minLength": 18,
								"maxLength": 18,
								"errorMessage": "学生身份证号码长度为 {minLength} 个字符"
							}
						]
					},
					{
						"type": "picker-date",
						"name": "student_birthday",
						"label": "学生出生日期"
					},
					{
						"type": "picker-city-china",
						"name": "registered_residence_city",
						"label": "户籍所在地",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请选择户籍所在地"
						}]
					},
					{
						"type": "textarea",
						"name": "registered_residence_detail",
						"placeholder": "请输入户籍所在地详细地址，需精确到村居、小区",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请填写户籍所在地详细地址"
						}]
					},
					{
						"type": "picker-city-china",
						"name": "current_residence_city",
						"label": "现居住地",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请选择现居住地"
						}]
					},
					{
						"type": "textarea",
						"name": "current_residence_detail",
						"placeholder": "请输入现居住地详细地址，需精确到村居、小区",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请填写现居住地详细地址"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_is_jdlkh",
						"label": "学生是否建档立卡户",
						"required": true,
						"options": [{
								"text": "是",
								"value": "0"
							},
							{
								"text": "否",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择学生是否建档立卡户"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_is_guer",
						"label": "学生是否孤儿",
						"required": true,
						"options": [{
								"text": "是",
								"value": "0"
							},
							{
								"text": "否",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择学生是否孤儿"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_is_lset",
						"label": "学生是否留守儿童",
						"required": true,
						"options": [{
								"text": "是",
								"value": "0"
							},
							{
								"text": "否",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择学生是否留守儿童"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_is_dqjt",
						"label": "学生是否单亲家庭",
						"required": true,
						"options": [{
								"text": "是",
								"value": "0"
							},
							{
								"text": "否",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择学生是否单亲家庭"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_is_jljs",
						"label": "学生军烈家属",
						"required": true,
						"options": [{
								"text": "是",
								"value": "0"
							},
							{
								"text": "否",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "学生军烈家属"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "student_is_sfcj",
						"label": "学生是否残疾",
						"required": true,
						"options": [{
								"text": "是",
								"value": "0"
							},
							{
								"text": "否",
								"value": "1"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "学生是否残疾"
						}]
					},
					{
						"type": "text",
						"name": "guardian_1_name",
						"label": "第一监护人姓名",
						"required": true,
						"rules": [{
								"required": true,
								"errorMessage": "请输入第一监护人姓名"
							},
							{
								"minLength": 2,
								"maxLength": 5,
								"errorMessage": "第一监护人姓名长度在 {minLength} 到 {maxLength} 个字符"
							}
						]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "guardian_1_relation",
						"label": "第一监护人关系",
						"required": true,
						"options": [{
								"text": "父亲",
								"value": "0"
							},
							{
								"text": "母亲",
								"value": "1"
							},
							{
								"text": "其他",
								"value": "2"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择第一监护人关系"
						}],
						"visibleOn": "!!data.guardian_1_name"
					},
					{
						"type": "text",
						"name": "guardian_1_relation_desc",
						"label": "第一监护人关系说明",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请输入第一监护人关系说明"
						}],
						"visibleOn": "data.guardian_1_relation === '2'"
					},
					{
						"type": "text",
						"name": "guardian_1_phone",
						"label": "第一监护人手机号",
						"required": true,
						"rules": [{
								"required": true,
								"errorMessage": "请输入第一监护人手机号"
							},
							{
								"pattern": "^1[3-9]\\d{9}$",
								"errorMessage": "第一监护人手机号格式不正确"
							}
						],
						"visibleOn": "!!data.guardian_1_name"
					},
					{
						"type": "text",
						"name": "guardian_1_work_unit",
						"label": "第一监护人工作单位或工作地点",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请输入第一监护人工作单位或工作地点"
						}],
						"visibleOn": "!!data.guardian_1_name"
					},
					{
						"type": "text",
						"name": "guardian_2_name",
						"label": "第二监护人姓名",
						"rules": [{
							"minLength": 2,
							"maxLength": 5,
							"errorMessage": "第二监护人姓名长度在 {minLength} 到 {maxLength} 个字符"
						}]
					},
					{
						"type": "checkbox",
						"multiple": false,
						"name": "guardian_2_relation",
						"label": "第二监护人关系",
						"required": true,
						"options": [{
								"text": "父亲",
								"value": "0"
							},
							{
								"text": "母亲",
								"value": "1"
							},
							{
								"text": "其他",
								"value": "2"
							}
						],
						"rules": [{
							"required": true,
							"errorMessage": "请选择第二监护人关系"
						}],
						"visibleOn": "!!data.guardian_2_name"
					},
					{
						"type": "text",
						"name": "guardian_2_relation_desc",
						"label": "第二监护人关系说明",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请输入第二监护人关系说明"
						}],
						"visibleOn": "data.guardian_2_relation === '2'"
					},
					{
						"type": "text",
						"name": "guardian_2_phone",
						"label": "第二监护人手机号",
						"required": true,
						"rules": [{
								"required": true,
								"errorMessage": "请输入第二监护人手机号"
							},
							{
								"pattern": "^1[3-9]\\d{9}$",
								"errorMessage": "第二监护人手机号格式不正确"
							}
						],
						"visibleOn": "!!data.guardian_2_name"
					},
					{
						"type": "text",
						"name": "guardian_2_work_unit",
						"label": "第二监护人工作单位或工作地点",
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请输入第二监护人工作单位或工作地点"
						}],
						"visibleOn": "!!data.guardian_2_name"
					},
					{
						"type": "checkbox",
						"name": "family_type",
						"label": "人口类型",
						"multiple": false,
						"mode": "button",
						"options": [{
								"text": "城区常住人口",
								"value": "0"
							},
							{
								"text": "随迁子女",
								"value": "1"
							},
							{
								"text": "驻盘部队的现役军人子女",
								"value": "2"
							},
							{
								"text": "参与救治新冠肺炎患者的一线医护人员及参加援鄂医疗队等抗疫最前线的医护人员的子女",
								"value": "3"
							}
						],
						"required": true,
						"rules": [{
							"required": true,
							"errorMessage": "请选择人口类型"
						}]
					},
					{
						"type": "textarea",
						"label": "其他说明",
						"name": "remark"
					}
				],
				"watch": {
					"student_id_number": {
						"student_birthday": "${data.student_id_number}.length >= 14 ? ${data.student_id_number}.substring(6, 10) + '-' + ${data.student_id_number}.substring(10, 12) + '-' + ${data.student_id_number}.substring(12, 14) : ''"
					}
				}
			}
		},
		methods: {
			onSubmit(data) {
				console.log(data)
			}
		}
	}
</script>
```

### 属性列表
|属性名|类型|默认值|说明|
|--	|--	|--	|--	|
|controls|Array|-|Form 表单项集合，详见下方`controls`说明|
|debug|Boolen|false|配置`debug:true`可以查看当前表单的数据域数据详情，方便数据映射、表达式等功能调试|
|initData|Object|-|初始化表单项数据|
|watch|Object|-|监听表单项数据变化并改变指定属性值内容|
|rules|Array|-|一般可以通过在表单项格式校验中，配置校验规则完成校验，但是有时候，我们需要组合多个表单项实现一些校验，这时可以通过配置 rules 来实现组合校验。|
|showSubmit|Boolen|true|显示提交按钮|
|submitText|String|提交|提交按钮的文本|

### controls 表单项集合通用配置
|属性名|类型|默认值|说明|
|--	|--	|--	|--	|
|type|String|-|指定表单项类型，所有类型详见下方|
|name|String|-|字段名，指定该表单项提交时的 key|
|label|String|-|表单项标签|
|value|All|-|表单项默认值|
|required|Boolen|false|是否必填|
|placeholder|String|-|占位内容|
|rules|Array|-|表单项格式校验|
|visibleOn|String|-|通过条件控制组件的显隐|

### type 表单项类型

#### text 文本输入框
通用配置

#### textarea 多行文本输入框
通用配置

#### password 密码输入框
通用配置

#### number 数字输入框
通用配置

#### picker-select 选择器
|属性名|类型|默认值|说明|
|--	|--	|--	|--	|
|options|Array|-|选项组，供用户选择，格式`{"text": "显示文本","value": "值"}`|

#### picker-city-china 城市选择器
通用配置

#### picker-date 日期选择器
|属性名|类型|默认值|说明|
|--	|--	|--	|--	|
|disabled|Boolen|false|是否禁用|

#### checkbox 勾选框
|属性名|类型|默认值|说明|
|--	|--	|--	|--	|
|multiple|Boolen|true|是否支持多选，false为单选框|
|options|Array|-|选项组，供用户选择，格式`{"text": "显示文本","value": "值"}`|

#### tpl 模板
通用配置