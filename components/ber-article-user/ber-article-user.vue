<template>
	<view class="ber-article-user" v-if="id&&details">
		<view class="na-title">
			<view class="text">报名</view>
			<view class="more" style="color: #00b7bd;display: flex;align-items: center;font-size: 26rpx;"> </view>
		</view>
		<view v-if="details.name" style="line-height: 1.1rem;display: flex;margin-bottom: 20rpx;" >
			<view style="white-space: nowrap;" class="font-grey ">标题：</view>
			<view style="word-break: break-word;" class="size-base">{{details.name}}</view>
		</view>
		<view v-if="details.content" style="line-height: 1.1rem;display: flex;margin-bottom: 20rpx;" >
			<view style="white-space: nowrap;" class="font-grey ">详情：</view>
			<view style="word-break: break-word;" class="size-base">
				<jyf-parser :html="details.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">
													加载中...</jyf-parser>
			</view>
		</view>
		<view style="display: flex;">
			<view style="flex: 1;padding: 20rpx 0 20rpx 30rpx;background-color: #e2fffc;color: #00a292;">
				<view>开始</view>
				<view>{{details.startat}}</view>
			</view>
			<view style="flex: 1;padding: 20rpx 0 20rpx 30rpx;background-color: #fff0e7;color: #f26b14;">
				<view>结束<text style="color: #ffaf7b;font-size: 24rpx;display: inline-block;padding-left: 16rpx;">共{{getDays(details.startat,details.endat)}}天</text></view>
				<view>{{details.endat}}</view>
			</view>
		</view>
		<view style="display: flex;justify-content: space-between;color: #aaaaaa;font-size: 24rpx;padding-top: 20rpx;padding-bottom: 20rpx;">
			<view>报名条件：{{getFuncOptVal(opts_all.user_wuye,details.type)}}</view>
			<view>已报名 {{user_total}}</view>
		</view>
		<view>
			<button v-if="!bool_entry" class="house-add_button-btn" type="primary" @click="addFuncEntryUserAdd">我要报名</button>
			<view v-else style="margin: auto;padding: 22rpx 0;text-align: center;background-color: #f0f9eb;color: #b3e19d;border: 2rpx solid #e1f3d8;border-radius: 20rpx;" >我已报名</view>
		</view>
		<view style="display: flex;justify-content: space-between;color: #aaaaaa;font-size: 24rpx;padding-top: 40rpx;">
			<view style="display: flex;align-items: center;">
				<uni-icons type="chat" size="18" color="#00b7bd" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
				有效报名
			</view>
			<view @click="openFuncPopup">数量{{user_valid_total}}</view>
		</view>
		<view class="na-card bg-white p-30" style="margin-top: 20rpx;">
			<view class="list-class-wwww" v-for="(item,i) in user_valid"  @click="openFuncPopup">
				<view style="flex-grow: 1;overflow: hidden;">
					<view class="ellipsis">{{item.oid}}</view>
					<view style="font-size: 24rpx; color: #aaaaaa;">
						<view style="display: inline-block;" @click.stop="clickFuncZan(item,opts_all.zan_cai[0].key)">
							<uni-icons type="hand-up" size="18" color="#aaaaaa" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
							<span>{{item.zan}}</span>
						</view>
						<view style="display: inline-block;" @click.stop="clickFuncZan(item,opts_all.zan_cai[1].key)">
							<uni-icons type="hand-down" size="18" color="#aaaaaa" style="padding-left: 20rpx;padding-right: 6rpx;font-weight: 900;"></uni-icons>
							<span>{{item.cai}}</span>
						</view>
					</view>
				</view>
				<view style="margin-left: 40rpx;">
					<uni-icons type="right" size="18" color="#aaaaaa" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" >
			<mescroll-body ref="mescrollRef" style="max-height: 70vh;min-height: 40vh;" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="list-class-wwww" v-for="(item,i) in all_list" >
					<view style="flex-grow: 1;overflow: hidden;">
						<view class="ellipsis">{{item.oid}}</view>
						<view style="font-size: 24rpx; color: #aaaaaa;">
							<view style="display: inline-block;" @click.stop="clickFuncZanPopup(item,opts_all.zan_cai[0].key)">
								<uni-icons type="hand-up" size="18" color="#aaaaaa" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
								<span>{{item.zan}}</span>
							</view>
							<view style="display: inline-block;" @click.stop="clickFuncZanPopup(item,opts_all.zan_cai[1].key)">
								<uni-icons type="hand-down" size="18" color="#aaaaaa" style="padding-left: 20rpx;padding-right: 6rpx;font-weight: 900;"></uni-icons>
								<span>{{item.cai}}</span>
							</view>
						</view>
					</view>
					<view style="margin-left: 40rpx;">
						<uni-icons type="right" size="18" color="#aaaaaa" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
					</view>
				</view>
			</mescroll-body>
		</uni-popup>
	</view>
</template>

<script>
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import {
		getEntryDetails,
		getEntryUserList,
		postEntryUserAdd,
		postAdd,
		delCai
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { USER_INFO } from '@/pages/framework/config/cache.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		name: 'berVoteUser',
		props: ['voteid'],
		watch: {
			voteid: {
				handler(new_val) {
					this.id = new_val
					if(this.id){
						this.getFuncVoteOptDetails()
						this.getFuncEntryValid()
						this.getFuncEntryAll()
						this.boolFunc()
					}
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				opts_all:{
					user_wuye:[],
					entry_valid:[],
					zan_cai:[]
				},
				id:'',
				details: '',
				user_total: 0,
				user_valid:[],
				user_valid_total:0,
				user_info:'',
				bool_entry:false,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
				    noMoreSize: 1 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				all_list:[]
			}
		},
		created() {
			this.user_info = this.utils.getUser()
			getOpts(['user_wuye','zan_cai']).then(res => {
				this.opts_all = res
			})
		},
		methods: {
			// 下拉刷新回调
			downCallback() {
			    this.mescroll.resetUpScroll()
			},
			//添加点赞踩
			clickFuncZanPopup(item,type){
				postAdd({
					mid:item.id,
					iszan:type
				}).then(res=>{
					this.downCallback()
				})
			},
			//添加点赞踩
			clickFuncZan(item,type){
				postAdd({
					mid:item.id,
					iszan:type
				}).then(res=>{
					this.getFuncEntryValid()
				})
			},
			// 取消点赞踩
			clickFuncCai(){
				delCai().then(res=>{
					
				})
			},
			// 打开弹窗
			openFuncPopup(){
				this.$refs.popup.open()
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					eid:this.id,	
				}
				if(page.num==1){
					this.all_list =[]
				}
				getEntryUserList(data).then(res=>{
					// this.all_list = this.all_list.concat(res.data.items)
					// this.mescroll.endByPage(res.data.items.length, res.data.aggregation.total_cnt);
					this.all_list = this.all_list.concat(res.data)
					this.mescroll.endByPage(res.data.length, res.data.aggregation.total_cnt);
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 是否已经报名
			boolFunc(){
				this.bool_entry = false
			},
			// 我要报名
			addFuncEntryUserAdd(){
				uni.showModal({
					title: '提示',
					content: '你确定要报名么？',
					success:  (res) => {
						if (res.confirm) {
							postEntryUserAdd({
								eid:this.id,
								oid:this.user_info.id
							}).then(res=>{
								uni.showToast({
									icon:'none',
									title: res.msg
								})
								setTimeout(()=>{
									this.getFuncEntryValid()
									this.getFuncEntryAll()
									this.boolFunc()
								},1000)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 获得人员列表
			getFuncEntryValid(){
				getEntryUserList({
							page:1,
							per_page:5,
							eid:this.id,
							isvalid: this.opts_all.entry_valid&&this.opts_all.entry_valid[0]&&this.opts_all.entry_valid[0].key || 1
				}).then(res=>{
					// this.user_valid = res.data.items
					this.user_valid = res.data
					this.user_valid_total = res.data.aggregation.total_cnt
				})
			},
			getFuncEntryAll(){
				getEntryUserList({
							page:1,
							per_page:3,
							eid:this.id,
						}).then(res=>{
					this.user_total = res.data.aggregation.total_cnt
				})
			},
			// 相隔几天
			getDays(strDateStart, strDateEnd) {
				return Math.ceil((new Date(strDateEnd).getTime() - new Date(strDateStart).getTime())/1000/60/60/24);
			},
			// 获取详情
			getFuncVoteOptDetails(){
				getEntryDetails(this.id).then(res=>{
					this.details = res.data
				}).catch(err=>{
					this.details = ''
				})
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>
<style lang="scss" scoped>
	.ber-article-user{
		 
	}
	.list-class-wwww{
		border-bottom: 2rpx solid #eeeeee;
		padding-bottom: 10rpx;
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;
	}
	.list-class-wwww:last-child{
		border-style: none;
		margin-bottom: 0;
	}
</style>
