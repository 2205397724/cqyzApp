<!--议事列表页-->
<template>
	<view>
		<view class="na-header m-b-10">
			<headbar backgroundColor='linear-gradient(-90deg, #00b7bd, #00d5c0)' :leftWidth='0' color="#ffffff" :rightText="isYwh?'发起议事':''" @clickRight="clickRight"></headbar>
			<uni-row class="na-main">
				<uni-col :span="18">
					<view class="na-header-title">
						<text class="title size-lx">议事</text>
						<text class="info p-t-20" v-if="zone_detail.name">{{zone_detail.name}}小区议事专题</text>
					</view>
				</uni-col>
				<uni-col :span="6">
					<view class="align-right">
						<text class="font-white size-base" @click="moreMessage">更多</text>
					</view>
				</uni-col>
			</uni-row>
			<!-- 专题列表 -->
			<view class="na-main p-t-20">
				<view class="bg-linear-orange2white border-radius-base p-30 m-t-20" @click="toDetails(item.id)" v-for="item in vein_list">
					<view class="font-extra size-lg">{{item.name}}</view>
					<view class="font-grey size-base p-t-20">时间：{{item.updated_at}}</view>
				</view>
			</view>
		</view>
		<view class="na-main">
			<view class="na-title">
				<text class="text">所有活动</text>
			</view>
		</view>
		<view class="na-main m-tb-20">
			<view class="flex-row flex-between">
				<view class="activity" :class="current == 0 ? 'active_activity' : ''" @click="changeActivity(0)"><text>问卷</text></view>
				<view class="activity" :class="current == 1 ? 'active_activity' : ''" @click="changeActivity(1)"><text>选举</text></view>
				<view class="activity" :class="current == 2 ? 'active_activity' : ''" @click="changeActivity(2)"><text>表决</text></view>
				<view class="activity" :class="current == 3 ? 'active_activity' : ''" @click="changeActivity(3)"><text>联名</text></view>
			</view>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main" v-if="activity_list.length>0">
				<view class="na-list m-t-10" v-for="item in activity_list" :key="item.id">
					<view class="na-list-item na-card bg-white m-b-10 p-20" @click="getDetail(item.id)">
						<view class="list-content" >
							<view class="h2 over-ellipsis" v-if="item.name">{{item.name}}</view>
							<!-- <view class="na-unread"></view> -->
							<view class="p-tb-20">
								<text class="na-tag1">
									<span v-if="item.type === 1">问卷</span>
									<span v-else-if="item.type === 2">选举</span>
									<span v-else-if="item.type === 3">表决</span>
									<span v-else-if="item.type === 4">联名</span>
								</text>
							</view>
							<view class="list-info" style="display: flex;flex-wrap: wrap;">
								<text v-if="item.author_user">发起主体：{{item.author_user.name || "匿名"}}</text>
								<text>发起时间：{{item.updated_at}}</text>
							</view>
							<!-- <ber-steps :steps_state="item.flow.steps" value="step" text="name" :steps_active="item.step" steps_color="#00b7bd"></ber-steps> -->
						</view>
					</view>
				</view>
			</view>
			<view class="na-main" v-else>
				<view class="p-40 font-grey size-base align-center">
					~暂无活动消息~
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {EQTYPE} from '@/pages/framework/config/app.js'
	import {
		getSurveyList,
		getVeinList
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { ZONE } from '@/pages/framework/config/cache.js'
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
				zone_detail:'',
				isYwh: false,
				current:0,//控制活动的选中状态
				vein_list:[],//事件(议事专题)列表
				activity_list:[],
				type:'',//活动类型
			}
		},
		onLoad(opts) {
			
		},
		onShow() {
			this.zone_detail = this.utils.getUserZone()
		},
		methods: {
			clickRight(){
				if(this.isYwh){
					this.utils.route('/pages/survey/add/add?')
				}
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					can_type:2
				}
				if(this.type) {
					data.type = this.type
				}
				this.getEventList();
				getSurveyList(data).then(res=>{
					this.activity_list = res.data
					this.mescroll.endSuccess(res.data.length)
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
			// 事件(议事专题)列表
			getEventList(){
				let data = {
					page:1,
					per_page:2,
					show:1
				}
				getVeinList(data).then(res=>{
					this.vein_list = res.data
				})
			},
			// 调整到议事专题列表页面（更多）
			moreMessage(){
				this.utils.route('/pages/vein/list/list')
			},
			// 改变活动类型
			changeActivity(index){
				this.current = index
				this.activity_list = []
				if(index === 0) {
					this.type = 1
				}else if(index === 1){
					this.type = 2
				}else if(index === 2){
					this.type = 3
				}else if(index === 3){
					this.type = 4
				}
				this.mescroll.resetUpScroll()
			},
			// 问卷列表
			getSueveyList(type){
				let data = {
					page:1,
					per_page:10,
					can_type:1
				}
				if(type) {
					data.type = type
				}
				getSurveyList(data).then(res=>{
					this.activity_list = res.data
				})
			},
			// 跳转到活动详情页，并传递活动id
			getDetail(id){
				this.utils.route('/pages/survey/detail/detail?id='+id)
			},
			// 跳转专题详情页
			toDetails(id){
				this.utils.route('/pages/vein/detail/detail?id='+id)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.announce-head{
		margin-bottom:40rpx;
	}
	.announce-task{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.announce-menu{
		box-sizing: border-box;
		padding-top:30rpx;
		padding-bottom: 20rpx;
	}
	.announce-search{
		box-sizing: border-box;
		padding-top:30rpx;
		padding-bottom: 20rpx;
	}
	.activity {
		width: 100rpx;
		height:100rpx;
		padding: 20rpx;
		background-color: $uni-text-color-inverse;
		border-radius:$uni-border-radius-base;
		display: flex;
		justify-content: center;
		align-items: center;
		text {
			color: $uni-text-color;
			font-size: $uni-font-size-base;
		}
	}
	.active_activity {
		background-color: $uni-theme-secondary;
		text {
			color:$uni-text-color-white;
			font-size: $uni-font-size-lg;
		}
	}
	
</style>
