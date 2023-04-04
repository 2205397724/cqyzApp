<template>
	<view class="house-bind-list">
		<headbar title="申请记录"></headbar>
		<mescroll-body style="min-height: calc(100vh - 88rpx);" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption"
			:up="upOption">
			<view class="ma-main" v-if="house_bind_list.length<=0">
				<view class="na-card bg-white p-30 font-grey size-base">暂无房屋绑定申请记录</view>
			</view>
			<view class="na-main" v-else>
				<view class="m-t-20" v-for="item in house_bind_list">
					<view class="na-card bg-white p-30">
						<view @click.stop="clickFuncDetails(item.id)">
							<view v-if="item.house">
								<view class="h2 over-ellipsis">{{item.house.pos_name||''}}{{item.house.name}}</view>
							</view>
							<view class="p-tb-10">
								<text class="na-tag3" v-if="item.status === 10">审核中</text>
								<text class="na-tag1" v-else-if="item.status === 20">审核通过</text>
								<text class="na-tag2" v-else>审核失败</text>
							</view>
							<view class="font-grey size-base">
								<view>申请人：{{item.name}}</view>
								<view>申请时间：{{item.updated_at}}</view>
								<view>申请角色：
									<text v-if="item.type === 1">业主</text>
									<text v-else>非业主</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<uni-popup ref="popup" type="bottom" >
			<view class="popup-box">
				<icon type="clear" size="24" @click="closePopup" style="position: fixed;right: 20rpx;top: 20rpx;"/>
				<view class="p-b-20" v-if="details.house">
					<view class="h2 over-ellipsis">{{details.house.pos_name||''}}{{details.house.name}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title font-grey size-base">申请人：</view>
					<view class="popup-content">{{details.name}}</view>
				</view>
				<!-- <view class="popup-item">
					<view class="popup-title font-grey">证件类别：</view>
					<view class="popup-content">{{ getFuncOptVal(opts_all.type_id_card,details.type_id_card)}}</view>
				</view> -->
				<view class="popup-item">
					<view class="popup-title font-grey size-base">证件号码：</view>
					<view class="popup-content">{{details.id_card}}</view>
				</view>
				<!-- <view class="popup-item">
					<view class="popup-title font-grey">手机号码：</view>
					<view class="popup-content">{{details.mobile}}</view>
				</view> -->
				<view class="popup-item">
					<view class="popup-title font-grey size-base">角色：</view>
					<!-- <view class="popup-content">{{ getFuncOptVal(opts_all.role_house,details.type)}}</view> -->
					<view class="popup-content">
						<text v-if="details.type === 1">业主</text>
						<text v-else>非业主</text>
					</view>
				</view>
				
				<view class="popup-item">
					<view class="popup-title font-grey size-base">申请时间：</view>
					<view class="popup-content">{{details.created_at}}</view>
				</view>
				<!-- <view class="popup-item">
					<view class="popup-title font-grey">修改时间：</view>
					<view class="popup-content">{{details.updated_at}}</view>
				</view> -->
				<view class="flex-column" v-if="details.affixs&&details.affixs.length>0">
					<view class="popup-title font-grey size-base">佐证材料：</view>
					<view class="flex-block">
						<view class="na-photo-box">
							<view class="photo-item" v-for="src in details.affixs">
								<view class="photo-item-image">
									<image @click="clickFuncImgShow(details.affixs,src)" :src="src" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-item">
					<view class="popup-title font-grey size-base">审核状态：</view>
					<!-- <view class="popup-content">{{ getFuncOptVal(opts_all.house_bind_status,details.status)}}</view> -->
					<view class="popup-content">
						<text class="na-tag3" v-if="details.status === 10">审核中</text>
						<text class="na-tag1" v-else-if="details.status === 20">审核通过</text>
						<text class="na-tag2" v-else>审核失败</text>
					</view>
				</view>
				<view class="popup-item">
					<view class="popup-title font-grey size-base">回执内容：</view>
					<view class="popup-content font-extra">{{details.reply}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
	
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		getHouseApplyList,
		getHouseApplyDetails,
		deleteHouseApply
	} from './service/api.js'
	export default {
		mixins: [MescrollMixin], // 使用mixinK
		components: { },
		data() {
			return {
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				opts_all:{},
				downOption: {},
				upOption: {
					page: {
						size: 15 // 每页数据的数量,默认10
					},
					noMoreSize: 1, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				house_bind_list: [],
				details: {}

			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: '申请记录'
			})
			// getOpts(['house_bind_status','role_house','type_id_card']).then(res => {
			//     this.opts_all = res
			// })
		},
		methods: {
			closePopup(){
				this.$refs.popup.close()
			},
			clickFuncDetails(id){
				this.$refs.popup.open()
				getHouseApplyDetails(id).then(res=>{
					res.data.affixs = []
					for(let i in res.data.affix){
						res.data.affixs.push(VITE_APP_FOLDER_SRC+res.data.affix[i])
					}
					for(let i in res.data.totlogs){
						res.data.totlogs[i].logable.affixs = []
						for(let j in res.data.totlogs[i].logable.affix){
							res.data.totlogs[i].logable.affixs.push(VITE_APP_FOLDER_SRC+res.data.totlogs[i].logable.affix[j])
						}
					}
					this.details = res.data
					this.$refs.popup.open()
				})
			},
			// 刷新
			refreshFunc(){
				this.mescroll.resetUpScroll()
			},
			
			// 上拉加载的回调
			upCallback(page) {
				this.mescroll.endSuccess(1)
				let data = {
					page: page.num,
					per_page: page.size
				}
				if(page.num==1){
					this.house_bind_list =[]
				}
				getHouseApplyList(data).then(res=>{
					this.house_bind_list =  this.house_bind_list.concat(res.data)
					this.mescroll.endSuccess(res.data.length);
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			getApplyList() {
				
			},
			// 预览图片
			clickFuncImgShow(arr,url){
				uni.previewImage({
					current:url,
					urls: arr,
				});
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		max-height: 70vh;
		min-height: 40vh;
		.popup-item{
			display: flex;
			padding: 10rpx 0;
			.popup-title{
				box-sizing: border-box;
				text-align: right;
			}
			.popup-content{
				
			}
		}
	}
</style>
