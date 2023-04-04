<template>
	<view>
		<view class="na-title">
			<view class="text">相关公示</view>
			<view class="more" style="color: #00b7bd;display: flex;align-items: center;font-size: 26rpx;"> </view>
		</view>
		<view class="na-card bg-white p-30">
			<view class="lassss-class-item" v-for="(item,i) in announce_list" @click="routeFunc(item)">
				<view style="background-color: #e2fffc;color: #00a292;width: 160rpx;height: 160rpx;min-width: 160rpx;min-height: 160rpx;margin-right: 30rpx;display: flex;background: #eeeeee;border-radius: 12rpx;justify-content: center;align-items: center;">
					经费<br/>收支
				</view>
				<view class="item-border-bottoms-a" style="font-size: 32rpx;border-bottom: 2rpx solid #eeeeee;padding-bottom: 16rpx;">
					<view style="flex-grow: 1;" >
						<view style="-webkit-line-clamp:2;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;overflow: hidden;">
							{{item.title}}
						</view>
					</view>
					<view style="padding-top: 10rpx;">
						<text class="na-tag2 m-b-10">7天</text>
							<text style="font-size: 24rpx;color: #aaaaaa;">公示主体：业委会</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	
	import {
		getAnnounceList
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { ZONE } from '@/pages/framework/config/cache.js'
	export default {
		props:['url','steptype'],
		data() {
			return {
				announce_list:[],
				zone:''
			}
		},
		created() {
			this.zone = this.utils.getUserZone()
			getOpts(['vote_or_biaojue','step_yt_type']).then(res => {
			    this.opts_all = res
			})
			this.getFuncArticleList()
		},
		methods: {
			getFuncArticleList(){
				let data = {
					page: 1,
					per_page: 5,
					china_code: this.zone.id
				}
				getAnnounceList(data).then(res=>{
					// this.announce_list = res.data.items
					this.announce_list = res.data
				})
			},
			routeFunc(item){
				this.utils.route('/pages/announce/detail/detail?id='+ item.id)
			},
			clickFuncGoPage(){
				this.utils.route('/pages/announce/add/add?')
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>

<style lang="scss" scoped >
	.lassss-class-item{
		display: flex;align-items: center;margin-bottom: 20rpx;
	}
	.lassss-class-item:last-child{
		margin-bottom: 0!important;
		// .item-border-bottoms-a{
		// 	border-style: none!important;
		// }
	}
</style>
