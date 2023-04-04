<template>
	<view style="padding-bottom: 106rpx;">
		<view class="na-header-white m-b-10">
			<headbar fixed="true" title="活动详情" rightIcon="redo" @clickRight="clickRightFunc"></headbar>
			<view class="na-main p-t-20">
				<view>
					<view class="size-lx strong">{{activity_detail.name}}</view>
					<view class="m-tb-10 flex-row flex-between">
						<view class="flex-row">
							<view class="na-tag1">
								<text v-if="activity_detail.status === 1">筹备阶段</text>
								<text v-if="activity_detail.status === 2">待审</text>
								<text v-if="activity_detail.status === 3">未开始</text>
								<text v-if="activity_detail.status === 4">进行中</text>
								<text v-if="activity_detail.status === 5">暂停</text>
								<text v-if="activity_detail.status === 6">终止</text>
								<text v-if="activity_detail.status === 7">已结束</text>
							</view>
							<!-- <view class="na-tag2">
								<text>万议第20211012001号</text>
							</view> -->
						</view>
						<view class="flex-row">
							<text class="font-grey size-sm" @tap="toReadlog(activity_detail.id)">阅读记录</text>
						</view>
					</view>
					<view class="">
						<text class="size-sm font-grey m-r-20" v-if="activity_detail.author_user">发起人：{{activity_detail.author_user.name || "匿名"}}</text>
						<text class="size-sm font-grey">时间：{{activity_detail.created_at}}</text>
					</view>
				</view>
				<!-- <view>
					<button class="btn-size-sm btn-extra" @click="activityResultCount(activity_detail.id)">活动结果统计</button>
				</view> -->
			</view>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main m-t-30">
				<view class="bg-linear-primary border-radius-base font-white">
					<view class="flex-row flex-center flex-end na-main p-tb-30"  @click="activityResultCount(activity_detail.id)">
						<text class="size-base">查看详情</text>
						<uni-icons type="info" size="24" color="#fff"></uni-icons>
					</view>
					<view class="flex-row flex-around">
						<view class="flex-column flex-center">
							<!-- 加v-if判断,否则组件渲染不出数据 -->
							<view class="flex-column flex-center" v-if="ticket_per != ''">
								<!-- 要传入不同的id以区分canvas，否则组件渲染会相同 -->
								<circle-progress
									:id="1"
									:progress="Math.ceil(ticket_per)"
									:width="100"
									:radius="10"
									:backgroundColor="'#01e6db'"
									:barColor="'#fff'"
									:isRound="true"
								></circle-progress>
							<view class="size-lg tocenter">{{ticket_per}}%</view>
							</view>
							<view class="font-white opacity-70 size-sm">
								<text>参与票/总票数</text>
							</view>
							<view class="size-lg">
								<text v-if="result_count.answer_cnt && result_count.tot">
									{{result_count.answer_cnt.online + result_count.answer_cnt.offline}}/{{result_count.tot.ticket}}
								</text>
							</view>
						</view>
						<view class="flex-column flex-center" v-if="area_per != ''">
							<view class="flex-column flex-center">
								<circle-progress
									:id="2"
									:progress="Math.ceil(area_per)"
									:width="100"
									:radius="10"
									:backgroundColor="'#01e6db'"
									:barColor="'#fff'"
									:isRound="true"
								></circle-progress>
								<view class="size-lg tocenter">{{area_per}}%</view>
							</view>
							<view class="font-white opacity-70 size-sm">
								<text>参与面积/总面积m²</text>
							</view>
							<view class="size-lg">
								<text v-if="result_count.answer_cnt && result_count.tot">
									{{result_count.area_has}}/{{result_count.tot.area}}
								</text>
							</view>
						</view>
					</view>
				</view>
				<view class="bg-linear-orange2white border-radius-base flex-row flex-around p-20">
					<view>
						<view class="font-primary size-lg strong opacity-70">开始</view>
						<view class="font-primary size-base opacity-70">{{activity_detail.startat}}</view>
					</view>
					<view>
						<view>
							<text class="font-extra size-lg strong">结束</text>
							<text class="font-extra size-xs p-l-20">共{{getDay(activity_detail.endat,activity_detail.startat)}}天</text>
						</view>
						<view class="font-extra size-base">{{activity_detail.endat}}</view>
					</view>
				</view>
				<!-- 内容 -->
			    <view class="m-t-40">
					<view class="na-title-sm">
						<text>内容</text>
					</view>
					<view class="size-lg">
						<!-- 这里是一段长html文本 -->
						<jyf-parser :html="activity_detail.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
					</view>
				</view>
			    <!-- 投票 -->
				<view class="m-t-40">
					<view class="na-title-sm">
						<text>投票</text>
					</view>
					<view class="na-card bg-white p-tb-20 na-main" v-if="survey_topic.length>0">
						<view v-if="Object.keys(user_answer).length>0">
							<view>
								<view class="size-lg font-primary">
									<text>您已参与本次活动</text>
								</view>
								<view class="p-tb-10">
									<text class="size-base font-grey">参与时间：</text>
									<text>{{updated_at}}</text>
								</view>
							</view>
							<view class="flex-row font-secondary size-base">
								<view class="flex-row" @click="showAnsewer">
									<text>{{isShowAnswer ? "收起详情" : "查看详情"}}</text>
									<uni-icons :type="isShowAnswer ? 'bottom' : 'right'" size="16" color="#04cecc"></uni-icons>
								</view>
								<view class="flex-row m-l-40" @click="activityResultCount(activity_detail.id)">
									<text>查看数据统计</text>
									<uni-icons type="right" size="16" color="#04cecc"></uni-icons>
								</view>
							</view>
							<!-- 展示用户答卷 -->
							<view class="m-t-30 border-t-grey p-t-20" v-show="isShowAnswer">
								<view class="size-lg" v-for="(item,index) in survey_topic" :key="item.id">
									<view class="warp p-t-20">
										<uni-icons v-show="item.type != 0" type="chat" size="22" color="#04cecc"></uni-icons>
										<text v-show="item.type != 0" class="size-lg strong">{{index+1}}、</text>
										<text class="size-lg strong">{{item.title}}</text>
			                            <text v-if="activity_detail.type === 2 && item.extra != null"
			                                class="size-base m-l-40 font-primary" 
			                                @click="showExtra(item.extra)">查看简介</text>
									</view>
									<!-- 单选题 -->
									<view v-if="item.type === 1">
										<radio-group>
											<label class="m-tb-40" v-for="(options,i) in item.opts" :key="i">
												<view class="flex-row m-tb-20">
													<radio disabled :checked="isChecked(options.id,item)"/>
													<text>{{options.content}}</text>
												</view>
											</label>
										</radio-group>
									</view>
									<!-- 多选题 -->
									<view v-else-if="item.type === 2">
										<checkbox-group v-for="(options,i) in item.opts" :key="i">
											<view class="flex-row p-tb-10">
												<checkbox disabled :checked="isChecked(options.id,item)"/>{{options.content}}
											</view>
										</checkbox-group>
									</view>
									<!-- 填空题 -->
									<view v-else-if="item.type === 3">
										<view class="uni-input bg-input-e m-tb-20 p-20">
											{{isChecked('options.id',item)}}
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 未参与 -->
			            <view v-else>
							<view class="size-lg" v-for="(item,index) in survey_topic" :key="item.id">
									<view class="warp p-t-20">
										<uni-icons v-show="item.type != 0" type="chat" size="22" color="#04cecc"></uni-icons>
										<text v-show="item.type != 0" class="size-lg strong">{{index+1}}、</text>
										<text class="size-lg strong">{{item.title}}</text>
			                            <text v-if="activity_detail.type === 2 && item.extra != null"
			                                class="size-base m-l-40 font-primary" 
			                                @click="showExtra(item.extra)">查看简介</text>
									</view>
									<!-- 单选题 -->
									<view v-if="item.type === 1">
										<radio-group>
											<label class="m-tb-40" v-for="(options,i) in item.opts" :key="i">
												<view class="flex-row m-tb-20" @click="chooseAnswer(item,index,i,options)">
													<radio :checked="options.checked==1 ? true :false"/>
													<text>{{options.content}}</text>
												</view>
											</label>
										</radio-group>
									</view>
									<!-- 多选题 -->
									<view v-else-if="item.type === 2">
										<checkbox-group v-for="(options,i) in item.opts" :key="i">
											<view class="flex-row p-tb-10">
												<checkbox @click="chooseAnswer(item,index,i,options)"/>
												{{options.content}}
											</view>
										</checkbox-group>
									</view>
									<!-- 填空题 -->
									<view v-else-if="item.type === 3">
										<textarea class="bg-light-grey border-radius-base m-tb-20 p-20" style="width:auto; max-height: 100rpx;" @blur="fillBlanks($event,item)" placeholder="请输入内容" value=""/></textarea>
									</view>
								</view>
								<button type="primary" @click="submit">提交</button>
						</view>
					</view>
					<view class="" v-else>
						暂无投票信息
					</view>
				</view>
				<!-- 审核记录 -->
				<view class="m-t-40">
					<view class="na-title-sm">
						<text>审核记录</text>
					</view>
					<view class="na-card bg-white p-tb-20"  v-if="activity_audit.length>0">
						<view class="na-steps-column m-l-40" v-for="item in activity_audit">
							<view class="na-steps-column-item" :class="item.status===20 ? 'active':'danger'">
								<view class="font-secondary">
									{{item.updated_at}}
								</view>
								<view v-if="item.auditor" class="p-t-20 p-b-10 font-grey">
									{{item.auditor.nickname || item.auditor.username}} {{item.auditor.mobile}}
								</view>
								<view v-if="item.reply" class="">
									回复：{{item.reply}}
								</view>
							</view>
						</view>
					</view>
					<view v-else class="na-card bg-white p-20 font-grey size-base">
						暂无审核记录
					</view>
				</view>
			    <commentLists :aid="activity_id"></commentLists>
			</view>
		</mescroll-body>
		<scrollBox :isShow="answers.length">
			<view class="p-30 bg-light-orange border-radius-base nowrap" style="box-shadow: 0px 0px 10px #ffcfcf;" v-show="!Object.keys(user_answer).length">
				<view class="font-grey size-base">
					已选择<span class="font-extra">{{answers.length}}</span>
					<span>/</span>
					总数<span class="font-primary">{{survey_topic.length}}</span>
				</view>
			</view>
		</scrollBox>
		<!-- 评论 -->
        <view class="na-bottom-tool bg-white">
            <commentToolbar ref="toolbar" :aid="activity_id" @refreshFn="todetails"></commentToolbar>
        </view>
        <uni-popup ref="popextra" type="center" style="overflow: auto;">
			<scroll-view :scroll-y="true" style="max-height: 60vh;">
				<jyf-parser :html="extra_message" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
			</scroll-view>
        </uni-popup>
	</view>
</template>

<script>
	import {
		getSurveyDetails,
		getSurveyRange,
		getAuditList,
		getAnnounceDetails,
		getResultCount,
		getSurveyTopic,
		postSurveyAnswer,
		getUserAnswer
	} from './service/api.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { ZONE } from '@/pages/framework/config/cache.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import {VITE_APP_FOLDER_SRC,SHARE_BASE_URL,URL_LOGO} from '@/pages/framework/config/app.js'
	import appShare,{ closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				activity_id:'',//活动id
				activity_detail:[],
				activity_range:[],
				activity_audit:[],//活动审核
				result_count:[],//活动结果统计
				ticket_per:'',//参与票百分比
				area_per:'',//参与面积百分比
				survey_topic:[],//问卷题目
				current:false,
				answers: [],//表单数据
				user_answer:[],//业主参与的答卷
				isShowAnswer:false,// 控制展示用户提交的答卷
				updated_at:'',//投票时间
                extra_message:"",//候选人的额外信息
				detailImgs:[],//内容图片
			}
		},
		onLoad(options) {
			this.activity_id = options.id
			this.zone_detail = this.utils.getUserZone()
			this.getDetails()
			this.getTopic()
		},
		methods: {
			/* 上拉加载的回调*/
			upCallback(page) {
				// 获取活动结果统计
				getResultCount(this.activity_id).then(res=>{
					this.result_count = res.data
					this.ticket_per = res.data.ticket_per
					this.area_per = res.data.area_per
				})
				this.getUserResult()
				this.mescroll.endSuccess(1)
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
            // 展示额外信息（候选人）
            showExtra(extra) {
                this.$refs.popextra.open()
                this.extra_message = extra.content
            },
			isChecked(optid,item) {
				let ischoose = false
				let hasAnswer = this.user_answer.filter(ans => ans.tid==item.id)
				if(item.type==1 || item.type==2){
					if(hasAnswer.length>0){
						let hasOpt = hasAnswer[0].opts.indexOf(optid)
						if(hasOpt>=0){
							ischoose = true
						}
					}
				}else if(item.type==3){
					ischoose = ''
					if(hasAnswer.length>0){
						ischoose = hasAnswer[0].content
					}
				}
				// this.user_answer.forEach(item => {
				// 	if(item.content) {
				// 		ischoose = item.content
				// 	}
				// 	if(tid === item.tid) {
				// 		item.opts.forEach(element => {
				// 			if(element.oid === optid) {
				// 				ischoose = true
				// 			}
				// 		})
				// 	}
				// })
				return ischoose
			},
			// 预览图片
			clickFuncImgShow(arr,url){
				let arrs = []
				for(let i in arr){
					arrs.push(VITE_APP_FOLDER_SRC+arr[i])
				}
				uni.previewImage({
					current:VITE_APP_FOLDER_SRC+url,
					urls: arrs,
				});
			},
			// 获取活动详情
			getDetails(){
				getSurveyDetails(this.activity_id).then(res=>{
					this.activity_detail = res.data
					let imgarr = []
					let content = this.activity_detail.content
					content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
						imgarr.push(capture);//正则去掉g为第一个
					});
					this.detailImgs = imgarr
				})
				// this.getRange()
				this.getAudit()
			},
			// 获取问卷题目
			getTopic() {
				let data = {
					page:1,
					per_page:500,
					sid:this.activity_id
				}
				getSurveyTopic(data).then(res=>{
					if(res.data.length === 0) return
					this.survey_topic = res.data.map(item=>{
						return {
							id:item.id,
							title:item.title,
							opts:item.opts.map(element=>{
								return {
									content:element.content,
									id:element.id,
									checked:0
								}
							}),
							type:item.type,
                            extra:item.extra
						}
					})
				})
			},
			// 获取业主参与的答卷
			getUserResult() {
				getUserAnswer(this.activity_id).then(res=>{
					// this.user_answer = res.data
					if(Object.keys(res.data).length === 0) return
					this.user_answer = res.data.answertopics.map(item => {
						return {
							tid:item.tid,
							opts:item.answeropts.map(element=>{
								return  element.oid
							}),
							content:item.content,
						}
					})
					this.updated_at =  res.data.updated_at
				})
			},
			// 获取活动参与范围
			// getRange(){
			// 	let data = {
			// 		page:1,
			// 		per_page:15,
			// 		sid:this.activity_id
			// 	}
			// 	getSurveyRange(data).then(res=>{
			// 		this.activity_range = res.data
			// 	})
			// },
			// 获取活动审核列表
			getAudit(){
				let data = {
					page:1,
					per_page:15,
					tgt_id:this.activity_id
				}
				getAuditList(data).then(res=>{
					this.activity_audit = res.data
				})
			},
			// 跳转评论详情
			todetails() {
			    this.utils.route('/pages/page/comments/comments?opt='+this.activity_id)
			},
			// 跳转活动结果统计
			activityResultCount(id){
				this.utils.route('/pages/survey/result_count/result_count?opt='+id+'&startat='+this.activity_detail.startat+'&endat='+this.activity_detail.endat+'&name='+this.activity_detail.name)
			},
			// 获取活动天数
			getDay(endat,startat) {
				return this.utils.dateDiff(endat,startat)
			},
			// 选中选项
			chooseAnswer(item,index,i,options) {
				const hasAnswer = this.answers.filter( ans => ans.tid == item.id)
				if(hasAnswer.length>0){//答案存在
					const hasOpt = hasAnswer[0].opt.indexOf(options.id)
					const ansKey = this.answers.findIndex( ans => ans.tid == item.id)
					if(item.type === 1) {//单选
						if(hasOpt==-1){// 选项不存在
							options.checked = 1
							this.answers.splice(ansKey,1)
							this.answers.push({
								tid:item.id,
								opt:[options.id]
							})
						}else{
							options.checked = 0
							this.answers.splice(ansKey,1)
						}
					}else if(item.type === 2){//多选
						if(hasOpt==-1){// 选项不存在
							this.answers[ansKey].opt.push(options.id)
						}else{
							this.answers[ansKey].opt.splice(this.answers[ansKey].opt.indexOf(options.id),1)
							if(this.answers[ansKey].opt.length==0){
								this.answers.splice(ansKey,1)
							}
						}
					}
				}else{//不存在
					options.checked = 1
					this.answers.push({
						tid:item.id,
						opt:[options.id]
					})
				}
				// for(let arr of this.survey_topic[index].opts) {
				// 	if(arr.id === options.id) {
				// 		if(item.type === 1) {
				// 			// 单选题
				// 			if(this.answers[index] !=undefined && this.answers[index].tid && this.answers[index].opt){
				// 				this.answers[index] = {
				// 					tid:this.survey_topic[index].id,
				// 					opt:''
				// 				}
				// 				options.checked=0
				// 			}else{
				// 				this.answers[index] = {
				// 					tid:this.survey_topic[index].id,
				// 					opt:[options.id]
				// 				}
				// 				options.checked=1
				// 			}
				// 		}else if(item.type === 2) {
				// 			// 多选题
				// 			// 判断是否为空，为空则赋值，否则插入选项
				// 			if(!this.answers[index]) {
				// 				this.answers[index] = {
				// 					tid:this.survey_topic[index].id,
				// 					opt:[options.id]
				// 				}
				// 			}else {
				// 				// 先判断是否存在，先删除再插入
				// 				if(this.answers[index].opt.indexOf(options.id) != -1) {
				// 					this.answers[index].opt.splice(this.answers[index].opt.indexOf(options.id),1)
				// 				}else {
				// 					this.answers[index].opt.push(options.id)
				// 				}
								
				// 			}
				// 		}
				// 	}
				// }
			},
			// 填空
			fillBlanks(event,item) {
				let content = event.target.value
				const hasAnswer = this.answers.filter( ans => ans.tid == item.id)
				if(hasAnswer.length>0){
					const ansKey = this.answers.findIndex( ans => ans.tid == item.id)
					this.answers.splice(ansKey,1)
					if(content.length>0){
						this.answers.push({
							tid:item.id,
							content:content
						})
					}
				}else{
					this.answers.push({
						tid:item.id,
						content:content
					})
				}
			},
			submit() {
				uni.showModal({
					title: '提示',
					content: '确定提交',
					success: res => {
						if (res.confirm) {
							postSurveyAnswer(this.activity_id,{answers:this.answers}).then(res=>{
								uni.showToast({
									icon: 'none',
									title: "提交成功",
									duration: 1000,
									mask:true
								})
								setTimeout(()=>{
									this.downCallback()
								},500)
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				});
			},
			// 展示用户提交的问卷结果
			showAnsewer() {
				this.isShowAnswer = !this.isShowAnswer
			},
			toReadlog(id){
				this.utils.route('/pages/page/readlog/readlog?id='+ id)
			},
			clickRightFunc(){
				let params = {
					m : 'survey',
					cc : this.utils.getUserCity().china_code,
					id : this.activity_detail.id
				}
				let shareData = {
					shareUrl:SHARE_BASE_URL + this.utils.urlParams(params),
					shareTitle:this.activity_detail.name,
					shareContent:'给您分享'+this.activity_detail.name+'赶紧看看吧！',
					shareImg: this.detailImgs[0] ? this.detailImgs[0] : URL_LOGO,
					appId : "", // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
					appPath : "",
					appWebUrl : "",
				};
				// 调用
				let shareObj = appShare(shareData,res => {
					closeShare();
				});
				setTimeout(() => {
					shareObj.close();
				},5000);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header{
		background: linear-gradient(-90deg, #00b7bd, #00d5c0);
		border-radius: 20rpx;
	}
	.selected {
		background-color: #d4f7f3;
		color: #00ccbf;
		font-weight: 900;
		position: relative;
		&::after {
			position: absolute;
			right:0;
			width:100rpx;
			height:100rpx;
			content: ' ';
			background-image: url(/static/icon/success@2x.png);
			background-repeat: no-repeat;
			background-size:50%;
		}
	}
	// 显示百分比到组件中心
	.tocenter {
		position: absolute;
		left: 50%; top: 50%;
		transform: translate(-50%, -50%); 
	}
	.choose_count {
		position: fixed;
		top: 50vh;
		right: 0;
	}
</style>
