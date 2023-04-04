<template>
	<view>
        <view class="na-header-white m-b-10">
            <headbar :fixed="true"></headbar>
            <view class="na-main strong size-lg">{{activity_name}}</view>
        </view>
        <view class="na-main">
            <view class="flex-row flex-between tabs m-tb-30">
            	<view class="tab-item" :class="{'on':tab_num==0}" @click="changeTab(0)">
            		<view class="">统计数据</view>
            	</view>
            	<view class="tab-item" :class="{'on':tab_num==1}" @click="changeTab(1)">
            		<view class="">参与房屋</view>
            	</view>
            </view>
			<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<!-- 投票结果 -->
				<view v-if="tab_num==0" class="">
					<view class="size-base font-grey m-b-20">总进度</view>
					<!-- 进度条 -->
					<view class="bg-white na-card flex-row flex-around p-tb-20">
						<view class="flex-column flex-center">
							<!-- 加v-if判断,否则组件渲染不出数据 -->
							<view class="flex-column flex-center" v-if="ticket_per != ''">
								<!-- 要传入不同的id以区分canvas，否则组件渲染会相同 -->
								<circle-progress
									:id="1"
									:progress="Math.ceil(ticket_per)"
									:width="100"
									:radius="10"
									:backgroundColor="'#ededed'"
									:barColor="'#24cfc8'"
									:isRound="true"
								></circle-progress>
							<view class="size-lg tocenter">{{ticket_per}}%</view>
							</view>
							<view class="font-grey size-sm">
								<text>参与票/总票数</text>
							</view>
							<view class="size-lg">
								<text v-if="result_count.answer_cnt && result_count.tot">
									{{result_count.answer_cnt.online + result_count.answer_cnt.offline}}/{{result_count.tot.ticket}}
								</text>
							</view>
						</view>
						<view class="flex-column flex-center">
							<!-- 加v-if判断,否则组件渲染不出数据 -->
							<view class="flex-column flex-center" v-if="area_per != ''">
								<!-- 要传入不同的id以区分canvas，否则组件渲染会相同 -->
								<circle-progress
									:id="2"
									:progress="Math.ceil(area_per)"
									:width="100"
									:radius="10"
									:backgroundColor="'#ededed'"
									:barColor="'#24cfc8'"
									:isRound="true"
								></circle-progress>
								<view class="size-lg tocenter">{{area_per}}%</view>
							</view>
							<view class="font-grey size-sm">
								<text>参与面积/总面积m²</text>
							</view>
							<view class="size-lg">
								<text v-if="result_count.answer_cnt && result_count.tot">{{result_count.area_has}}/{{result_count.tot.area}}</text>
							</view>
						</view>
					</view>
					<!-- <view class="size-sm m-tb-20">参与方式</view>
					<view class="bg-white na-card">
						123456
					</view> -->
					<view class="size-base font-grey p-t-30 m-b-20">数量</view>
					<view class="na-card bg-white p-tb-30">
						<view class="flex-row flex-around">
							<view class="flex-column flex-center">
								<text class="strong size-lx font-extra" v-if="result_count.tot">{{result_count.tot.ticket}}</text>
								<text class="size-sm font-grey">总票数</text>
							</view>
							<view class="flex-column flex-center">
								<text class="strong size-lx font-extra" v-if="result_count.tot">{{result_count.tot.area}}m²</text>
								<text class="size-sm font-grey">总面积</text>
							</view>
							<view class="flex-column flex-center">
								<text class="strong size-lx font-extra">{{result_count.house_tot_cnt}}</text>
								<text class="size-sm font-grey">总房屋数</text>
							</view>
						</view>
						<view class="flex-row flex-around p-t-20">
							<view class="flex-column flex-center">
								<text class="strong size-lx font-extra" v-if="result_count.answer_cnt">{{result_count.answer_cnt.online}}</text>
								<text class="size-sm font-grey">线上参与</text>
							</view>
							<view class="flex-column flex-center">
								<text class="strong size-lx font-extra" v-if="result_count.answer_cnt">{{result_count.answer_cnt.offline}}</text>
								<text class="size-sm font-grey">线下参与</text>
							</view>
							<view class="flex-column flex-center">
								<text class="strong size-lx font-extra">{{result_count.house_has_cnt}}</text>
								<text class="size-sm font-grey">已参与房屋</text>
							</view>
						</view>
					</view>
                	<view class="m-tb-30 flex-row flex-center flex-between">
                		<view class="size-base font-grey">选项详情</view>
                		<view class="flex-row size-sm">
                			<view class="activity" :class="current == 0 ? 'active_activity' : ''" @click="changeResultType(0)"><text>总占比</text></view>
                			<view class="activity" :class="current == 1 ? 'active_activity' : ''" @click="changeResultType(1)"><text>按参与占比</text></view>
                		</view>
                	</view>
					<!-- 票数详情 -->
					<view class="bg-white na-card m-b-20 p-30" v-for="(item,i) in survey_topic">
						<view class="flex-column" v-show="item.type === 1 || item.type === 2">
							<view class="flex-row size-lg strong">
								<view class="p-r-10" v-show="item.type != 0"><uni-icons type="chat" size="20" color="#fb9131"></uni-icons></view>
								<text>{{item.title}}</text>
							</view>
							<view v-for="opts in item.opts">
								<view class="progress-box p-t-30" v-show="isShow(opts.id)">
									<text class="strong">{{opts.content}}</text>
									<view class="size-xs font-grey">
										<view class="flex-row flex-end">
											<text class="m-r-10 font-primary">{{cntper}}%</text>
											<text>{{cnt}}</text>
										</view>
										<view class="flex-row">
											<text class="m-r-20">票数</text>
											<progress style="flex: 1;" :percent="cnt_percentage || 0" activeColor="#24cfc8"/>
										</view>
									</view>
									<view class="size-xs font-grey">
										<view class="flex-row flex-end">
											<text class="m-r-10 font-primary">{{areapers}}%</text>
											<text>{{area}}</text>
										</view>
										<view class="flex-row">
											<text class="m-r-20">面积</text>
											<progress style="flex: 1;" :percent="area_percentage" activeColor="#24cfc8"/>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 参与范围 -->
				<view v-if="tab_num==1" class="bg-white na-card">
					
					<view class="flex-row flex-around p-b-20">
						<view class="strong flex-column flex-center">
							<text class="size-lx font-extra">{{result_count.area_has}}m²</text>
							<text class="size-sm">已参与面积</text>
						</view>
						<view class="strong flex-column flex-center">
							<text class="size-lx font-extra">{{result_count.area_per}}%</text>
							<text class="size-sm">参与率</text>
						</view>
					</view>
				</view>
			</mescroll-body>
        </view>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getResultCount,
		getSurveyTopic,
        getNotParticipate,
		getParticipate
	} from './service/api.js'
	let cnt_percentage = {}//选项百分比
	let cntper = ''
	let cnt = ''//选项数量
	let area_percentage = {}//选项的面积和百分比
	let area = ''
	let areapers = ''
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
                // cnt_percentage:{},
                // cntper:'',
                // cnt:'',
                // area_percentage:{},
                // area:'',
                // areapers:'',
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				active_date: new Date().getFullYear(),
				tab_num: 0,
				activity_id:'',// 活动ID
				result_count:[],//活动结果统计
				survey_topic:[],//问卷题目
				opts:[],//已选的选项列表
				opt_area:[],//含面积的选项列表
                activity_name:'',
				startat:'',
				endat:'',
				ticket_per:'',//参与票百分比
				area_per:'',//参与面积百分比
				// cnt_percentage:'',//选项的数量和百分比
				// percentage:0//控制progress的百分比
				current:1,//0：票数占总票数的百分比。1：票数占已投票的百分比
			}
		},
		onLoad(opts) {
			this.endat = opts.endat
			this.startat = opts.startat
			this.activity_id = opts.opt
            this.activity_name = opts.name
		},
		methods: {
			/* 上拉加载的回调*/
			upCallback(page) {
				if(this.tab_num==0){
					this.getResult()
					this.getTopic()
					this.mescroll.endSuccess(1)
				}
				if(this.tab_num==1){
					// getNotParticipate(this.activity_id).then(res=>{
					// 	console.log("res.data",res.data)
					// })
					this.mescroll.endSuccess(1)
				}
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			// 切换tab
			changeTab(tab) {
				this.tab_num = tab
				this.mescroll.resetUpScroll()
			},
			// 获取活动结果统计
			getResult() {
				getResultCount(this.activity_id).then(res=>{
					this.result_count = res.data
					this.opts = res.data.opt_cnt_map
					this.opt_area = res.data.opt_area_map
					this.ticket_per = res.data.ticket_per
					this.area_per = res.data.area_per
				})
			},
			// 获取问卷题目
			getTopic() {
				let data = {
					page:1,
					per_page:500,
					sid:this.activity_id
				}
				getSurveyTopic(data).then(res=>{
					this.survey_topic = res.data.map(item=>{
						return {
							id:item.id,
							title:item.title,
							opts:item.opts.map(element=>{
								return {
									content:element.content,
									id:element.id
								}
							}),
							type:item.type
						}
					})
					// console.log("this.survey_topic",this.survey_topic)
				})
			},
			// 判断选项是否被选中，显示有人选中的选中的选项
			isShow(id) {
                let that = this
				that.showAreaPercentage(id)
				return that.showCntPercentage(id)
			},
			// 显示选项的数量和百分比
			showCntPercentage(id) {
                let that = this
				if(this.current == 1) {
					for(let key of this.opts){
						if(id === key.oid) {
							// let per = key.cnt/this.result_count.tot.ticket*100
							let per = key.cnt/(this.result_count.answer_cnt.online + this.result_count.answer_cnt.offline)*100
                            let a = per.toFixed(2)
                            let b = Math.floor(per)
                            let c = '(' + key.cnt + '/' + (this.result_count.answer_cnt.online + this.result_count.answer_cnt.offline) + ')'
							this.cntper = JSON.parse(JSON.stringify(a))
							this.cnt_percentage = JSON.parse(JSON.stringify(b))
							this.cnt = JSON.parse(JSON.stringify(c))
							return true
						}
					}
				}else {
					for(let key of this.opts){
						if(id === key.oid) {
							let per = key.cnt/this.result_count.tot.ticket*100
                            let a = per.toFixed(2)
                            let b = Math.floor(per)
                            let c = '(' + key.cnt + '/' + this.result_count.tot.ticket + ')'
							that.cntper = JSON.parse(JSON.stringify(a))
							that.cnt_percentage = JSON.parse(JSON.stringify(b))
							that.cnt = JSON.parse(JSON.stringify(c))
							return true
						}
					}
				}
			},
			// 显示选项的面积和百分比
			// showAreaPercentage(area) {
			// 	let per = area/this.result_count.tot.area*100
			// 	this.area_percentage = Math.floor(per)
			// 	// this.area_percentage = area+"m²("+per.toFixed(2)+"%)"
			// 	this.area_percentage = area+"m²"
			// }
			showAreaPercentage(id) {
                let that = this
				if(this.current == 1) {
					for(let key of this.opt_area){
						if(id === key.oid) {
							// let per = key.area/this.result_count.tot.area*100
                            let per = key.area/(this.result_count.area_has)*100
                            let a = per.toFixed(2)
                            let b = Math.floor(per)
                            let c = '(' + key.area + '/' + this.result_count.area_has + 'm²)'
							that.areapers = JSON.parse(JSON.stringify(a))
							that.area_percentage = JSON.parse(JSON.stringify(b))
							that.area = JSON.parse(JSON.stringify(c))
							return true
						}
					}
				}else {
					for(let key of this.opt_area){
						if(id === key.oid) {
                            let per = key.area/this.result_count.tot.area*100
                            let a = per.toFixed(2)
                            let b = Math.floor(per)
                            let c = '(' + key.area + '/' + this.result_count.tot.area + 'm²)'
							that.areapers = JSON.parse(JSON.stringify(a))
							that.area_percentage = JSON.parse(JSON.stringify(b))
							that.area = JSON.parse(JSON.stringify(c))
							return true
						}
					}
				}
			},
			// 改变活动类型
			changeResultType(index){
				this.current = index
			},
		}
	}
</script>

<style lang="scss" scoped>
    .tabs {
        .tab-item {
            width: 300rpx;
            line-height: 70rpx;
            background-color: #fff;
            border-radius: 10rpx;
            text-align: center;
        }
        .tab-item.on {
            background-color:$uni-theme-secondary;
            color: #fff;
        }
    }
    .opt-relative {
        position: relative;
        top: 20rpx;
    }
	// 显示百分比到组件中心
	.tocenter {
		position: absolute;
		left: 50%; top: 50%;
		transform: translate(-50%, -50%); 
	}
	.activity {
		padding: 0 20rpx;
		height:50rpx;
		background-color: $uni-text-color-inverse;
		border-radius: 10rpx;
		text-align: center;
		text {
			color:$uni-text-color-grey;
			line-height:50rpx;
		}
	}
	.active_activity {
		background-color:$uni-theme-secondary;
		text {
			color: #fff;
		}
	}
</style>
