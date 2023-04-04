<template>
	<view>
		<headbar fixed="true" title="专题" ></headbar>
		<view class="na-header-white na-main m-b-10">
			<view class="size-lg strong p-b-20">{{vein_details.name}}</view>
			<mp-html class="font-grey size-base" v-if="vein_details.desc" :content="vein_details.desc"></mp-html>
			<text class="font-grey size-base" v-else>暂无内容</text>
		</view>
		<!-- 跟踪日志 -->
		<view class="na-main">
			<view class="na-title">
				<text class="text">事件脉络</text>
				<!-- <view class="flex-row">
					<view class="btn-primary btn-size-sm btn-block ">添加关联活动</view>
				</view> -->
			</view>
			<view class="na-card p-tb-20 bg-white">
				<view class="na-steps-column m-l-40" v-for="item in activity_list">
					<view class="na-steps-column-item p-10 active" v-if="item.docable" @click="getDetail(item)">
						<view class="steps-item-content font-primary">
							{{item.docable.title || item.docable.name}}
						</view>
						<view class="steps-item-discription flex-row">
							<view class="steps-item-discription p-r-20">{{item.created_at}}</view>
							<text v-if="item.docable.uinfo">发布人：{{item.docable.uinfo.nickname || item.docable.uinfo.name || item.docable.uinfo.username || '匿名'}}</text>
							<text v-else>发布人：匿名用户</text>
						</view>
						<view class="p-t-10 flex-row">
							<view class="na-tag2">
								<text v-if="item.tgt_type == 'announce'">公示</text>
								<text v-else-if="item.tgt_type == 'survey'">议事</text>
							</view>
							<view class="na-tag1" v-if="item.docable.type">
								<text v-if="item.docable.type === 1">问卷</text>
								<text v-else-if="item.docable.type === 2">投票</text>
								<text v-else-if="item.docable.type === 3">表决</text>
								<text v-else-if="item.docable.type === 4">联名</text>
							</view>
						</view>
					</view>
					<!-- <view class="na-steps-column-item">
						<view class="steps-item-time">2021-10-01 15:12</view>
						<view class="steps-item-content">
							春天花园首次业主大会受理通知公示
						</view>
						<view><text class="na-tag1">公示</text></view>
						<view class="steps-item-discription">发布人：社区主任 李**</view>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getVeinDetail,
		getVeinActivityList
	} from './service/api.js'
	import {VITE_APP_FOLDER_SRC,SHARE_BASE_URL,URL_LOGO} from '@/pages/framework/config/app.js'
	import appShare,{ closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare'
	export default {
		data() {
			return {
				event_id:'',
				vein_details:{},// 事件（主题）详细
				activity_list:[],// 事件下所有活动
				detailImgs:[],//内容图片
			}
		},
		onLoad(opts) {
			// console.log("id",opts.opt)
			this.event_id = opts.id
			this.getThemeDetail()
			this.getActivityList()
		},
		methods: {
			// 获取事件（主题）详细
			getThemeDetail(){
				getVeinDetail(this.event_id).then(res=>{
					this.vein_details = res.data
					let imgarr = []
					let content = this.vein_details.desc
					content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
						imgarr.push(capture);//正则去掉g为第一个
					});
					this.detailImgs = imgarr
				})
			},
			// 获取事件下所有活动
			getActivityList(){
				getVeinActivityList(this.event_id).then(res=>{
					this.activity_list = res.data
				})
			},
			// 跳转到活动详情页，并传递活动id和类型
			getDetail(item){
				if(item.tgt_type == "survey"){
					this.utils.route('/pages/survey/detail/detail?id='+item.docable.id)
				}else if(item.tgt_type == "announce"){
					this.utils.route('/pages/announce/detail/detail?id='+item.docable.id)
				}
				
			},
			clickRightFunc(){
				let params = {
					m : 'vein',
					cc : this.utils.getUserCity().china_code,
					id : this.vein_details.id
				}
				let shareData = {
					shareUrl:SHARE_BASE_URL + this.utils.urlParams(params),
					shareTitle:this.vein_details.name,
					shareContent:'给您分享'+this.vein_details.name+'赶紧看看吧！',
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
	.na-steps-column-item {
		padding: 0;
	}
</style>
