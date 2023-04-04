<template>
    <view>
		<headbar  backgroundColor="transparent"></headbar>
        <mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main">
				<view class="flex-row flex-start">
					<view class="badge-sm border-radius-base bg-light-green p-30">
						<image src="/static/chat/systemable.png" mode="widthFix"></image>
					</view>
					<view class="p-l-20">
						<view class="size-base">{{user_message_detail.title}}</view>
						<view class="size-sm font-grey p-t-10">{{user_message_detail.updated_at}}</view>
					</view>
				</view>
			</view>
			<view class="na-main m-tb-30">
				<view class="na-card bg-white p-30 size-lg line-height-170">
					<view class="">
						<text>{{user_message_detail.content}}</text>
						<view v-if="user_message_detail.payload" class="font-primary" @tap="toDetail(user_message_detail.payload)">
							查看详情  >> 
						</view>
					</view>
				</view>
			</view>
        </mescroll-body>
    </view>
</template>
<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getMessageList,
		getMessageDetail
	} from './service/api.js'
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
				user_message:[],
				//用户信息列表传递过来的值
				notice:'',
				user_message_list:[],
				user_message_detail:[],
			}
		},
		created(){
			
		},
		onLoad(options) {
			this.notice = options.notice;
		},
		methods: {
			// 获取通知详情
			getDetail() {
				getMessageDetail(this.notice).then(res=>{
					this.user_message_detail = res.data
				})
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				this.getDetail()
				this.mescroll.endSuccess(1)
			},
			toDetail(item){
				if(Object.keys(item).length>0){
					if(item.tgt_type=='share_record'){
						uni.navigateTo({
							url:'/pages/share/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='elect'||item.tgt_type=='vote'||item.tgt_type=='survey'||item.tgt_type=='jointly'){
						uni.navigateTo({
							url:'/pages/survey/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='announce'){
						uni.navigateTo({
							url:'/pages/announce/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='news'){
						uni.navigateTo({
							url:'/pages/news/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='complaint'){
						uni.navigateTo({
							url:'/pages/complaint/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='repair'){
						uni.navigateTo({
							url:'/pages/repair/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='illegal'){
						uni.navigateTo({
							url:'/pages/illegal/detail/detail?id='+item.tgt
						})
					}
					if(item.tgt_type=='vein'){
						uni.navigateTo({
							url:'/pages/vein/detail/detail?id='+item.tgt
						})
					}
				}
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
		}
	}
</script>
<style lang="scss" scoped>
	
</style>
