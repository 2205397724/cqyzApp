<template>
    <view >
		<!--顶部 开始-->
		<view class="header">
			<!--顶部工具-->
			<surplus-hair></surplus-hair>
			<uni-row class="headerbar">
				<uni-col :span="12" class="headerbar-city">
					<view @click="chooseCityFunc" class="flex-row flex-center">
						<image src="/static/index/city@3x.png"></image>
						<text>{{active_city.name||'请选择'}}</text>
					</view>
				</uni-col>
				<uni-col :span="12" class="headerbar-tools">
					<view class="tool-item">
						<image src="/static/index/scaner@2x.png" @click="scanFunc"></image>
					</view>
					<view class="tool-item">
						<ber-route url="/pages/binding/choose/choose"><image src="/static/index/house-add@2x.png"></image></ber-route>
					</view>
					<view @click="goSwitchFunc('/pages/tabbar/chat/view/index',false)">
						<view class="tool-item message">
							<view class="tag-sm" v-if="message_count>0">{{message_count}}</view>
							<image src="/static/index/messages.png"></image>
						</view>
					</view>
				</uni-col>
			</uni-row>
			<!--顶部小区相关功能菜单-->
			<view class="zone">
				<view class="zone-title">
					<view style="width: 60%;display: flex;justify-content: center;align-items: center;"  @click="chooseZoneFunc">
						<text style="display: inline-block;" class="ellipsis">{{active_zone.name||'请选择您的小区！'}}</text>
						<image src="/static/icon/toleft_p@2x.png"></image>
					</view>
				</view>
				<view class="zone-menu">
					<view @click="goPagesFunc('/pages/zones/detail/detail')" class="zone-menu-item">
						<image src="/static/index/info.png"></image>
						<text>小区资料</text>
					</view>
					<view @click="goPagesFunc('/pages/announce/list/list')"  class="zone-menu-item">
						<image src="/static/index/announce.png"></image>
						<text>小区公示</text>
					</view>
					<view @click="goSwitchFunc('/pages/survey/list/list',true)"  class="zone-menu-item">
						<image src="/static/index/discuss.png"></image>
						<text>小区议事</text>
					</view>
					<view @click="goPagesFunc('/pages/zones/company/company')"  class="zone-menu-item">
						<image src="/static/index/service.png"></image>
						<text>小区物业</text>
					</view>
					<!-- <view @click="goPagesFunc('/pages/zones/committee/committee')"   class="zone-menu-item">
						<image src="/static/index/yewei.png"></image>
						<text>小区业委</text>
					</view> -->
				</view>
			</view>
		</view>
		<!--金刚菜单图标-->
		<view class="flex-row p-tb-30">
			<view class="zmenu-item" @click="goPagesFunc('/pages/complaint/list/list')" >
				<image src="/static/index/zmenu8@2x.png"></image>
				<text>物业投诉</text>
			</view>
			<view class="zmenu-item" @click="goPagesFunc('/pages/repair/list/list')" >
				<image src="/static/index/zmenu10@2x.png"></image>
				<text>物业报修</text>
			</view>
			<!-- <ber-route class="zmenu-item" url="/pages/payment/payment">
				<image src="/static/index/zmenu3.png"></image>
				<text>物业缴费</text>
			</ber-route> -->
			<view class="zmenu-item" @click="goPagesFunc('/pages/news/list/list',false)" >
				<image src="/static/index/zmenu7@2x.png"></image>
				<text>行业资讯</text>
			</view>
			<view class="zmenu-item" @click="goPagesFunc('/pages/mine/house/house')" >
				<image src="/static/index/zmenu13@2x.png"></image>
				<text>我的房屋</text>
			</view>
		</view>
		<!--通知-->
		<!-- <view class="notice">
			<view class="notice-icon"><image src="/static/icon/notice.png" mode="widthFix"></image></view>
			<view class="notice-text">关于富民花园13栋电梯故障通知</view>
		</view> -->
		<!--内容 小区议事-->
		<view class="na-main">
			<view class="na-box">
				<view class="na-title">
					<view class="text">小区议事</view>
					<view class="more" @click="toMore('activity')">查看更多</view>
				</view>
				<view class="na-body">
					<view class="zdiscuss">
						<!-- <uni-row class="zdiscuss-head">
							<uni-col :span="12">
								<view class="zdiscuss-head-item important">
									<view class="label-icon">
										<image src="/static/index/important.png" mode="widthFix"></image>
									</view>
									<view class="label-text">
										<text class="label-text-tit">重要</text>
										<text>重大事件群力群策</text>
									</view>
								</view>
							</uni-col>
							<uni-col :span="12">
								<view class="zdiscuss-head-item unimportance">
									<view class="label-icon">
										<image src="/static/index/unimportance.png" mode="widthFix"></image>
									</view>
									<view class="label-text">
										<text class="label-text-tit">普通</text>
										<text>普通事件人人参与</text>
									</view>
								</view>
							</uni-col>
						</uni-row> -->
						<view class="na-card bg-white p-30" v-if="activity_list.length>0">
							<view class="na-title-sm">议事进行中</view>
							<view class="zdiscuss-body" v-for="activity in activity_list">
								<view class="zdiscuss-info p-tb-20" @tap="toSurveyDetail(activity.id)">
									<view class="text size-lg">{{activity.name}}</view>
									<view class="p-t-20">
										<text class="na-tag1">{{getOptVal(status,activity.status)}}</text>
										<text class="font-grey size-base">开始时间：{{activity.startat}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="na-card bg-white p-30 font-grey size-base" v-else>
							暂无议事~
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--内容 小区公示-->
		<view class="na-main">
			<view class="na-box">
				<view class="na-title">
					<view class="text">小区公示</view>
					<view class="more" @click="goPagesFunc('/pages/announce/list/list')">查看更多</view>
				</view>
				<view class="na-body">
					<view class="announce">
						<scroll-view class="scroll-view_H" scroll-x="true">
							<view class="announce-head flex-row" @click="goPagesFunc('/pages/announce/list/list')">
								<view v-for="item in announce_cate">
									<view class="announce-head-item">
										<image src="/static/index/imenu.png" mode="widthFix"></image>
										<text>{{item.name}}</text>
									</view>
								</view>
							</view>
						</scroll-view>
						<view class="na-card bg-white p-30" v-if="announce_list.length>0">
							<view class="na-title-sm">公示中</view>
							<view class="" v-for="item in announce_list"  @tap="toAnnounceDetails(item.id)">
								<uni-row class="announce-body p-tb-30">
									<uni-col :span="6">
										<view class="announce-cate" v-if="item.cate">{{item.cate.name}}</view>
									</uni-col>
									<uni-col :span="18">
										<view class="announce-info">
											<view class="text">{{item.title}}</view>
											<view class="p-tb-10">
												<!-- <text class="na-tag2" v-if="item.cate">{{item.cate.name}}</text> -->
												<text class="na-tag1">{{item.proof || item.toval_name}}</text>
											</view>
											<view>
												<text v-if="item.authorgroup" class="font-grey size-base p-r-20">
													{{item.authorgroup.name}}
												</text>
												<text class="font-grey size-base" v-if="item.uinfo">{{item.uinfo.nickname || item.uinfo.username}}</text>
											</view>
										</view>
									</uni-col>
								</uni-row>
							</view>
						</view>
						<view class="na-card bg-white p-30 font-grey size-base" v-else>
							暂无公示~
						</view>
					</view>
				</view>
			</view>
		</view>
		<view @touchmove.stop.prevent="()=>{return false;}">
			<uni-popup ref="popup" type="bottom" @change="changeFuncPopup">
				<view class="font-grey size-base border-b-grey p-b-20">切换小区</view>
				<mescroll-body ref="mescrollRef" style="max-height:70vh;min-height:40vh;" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view v-for="(item,i) in zone_list" :key="item.id" @click="chooseFuncZone(item)" class="flex-row flex-center flex-between p-tb-30 border-b-grey">
						<view>
							<view class="size-lg strong over-ellipsis" :class="{'active':item.id==active_zone.id}">{{item.name}}</view>
							<view class="p-t-10 font-grey size-base" :class="{'active opacity-50':item.id==active_zone.id}">
								<text class="p-r-20">共{{ item.cnt_building }}栋</text>
								<text class="p-r-20">户数：{{ item.cnt_live }}户</text>
								<text class="">建筑面积：{{item.area_build}}㎡</text>
							</view>
						</view>
						<view style="margin-left: 20rpx;">
							<uni-icons type="checkbox" size="30" :color="item.id==active_zone.id?'#00a292':'f1f1f1'"></uni-icons>
						</view>
					</view>
				</mescroll-body>
			</uni-popup>
		</view>
		<view class="font-grey size-base align-center p-tb-40 m-b-40">~ 我是底线 ~</view>
		<view class="font-grey size-base align-center p-tb-30"></view>
    </view>
</template>
<script>
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import {
		REGION,
		ZONE
	} from '@/pages/framework/config/cache.js'
	import {
		getZoneMe,
		getZoneCom,
		getUserGroup,
		getMessageList,
		getSurveyList,
		getAnnounceList,
		getAnnounceKind
	} from '../service/api.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import permision from "@/pages/framework/utils/permission/permission.js"
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import app from '../../../framework/config/app.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				getOptVal:getOptVal,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {
				    native: true
				},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
				    noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				}, 
				active_city:'',
				active_zone:'',
				user_info:'',
				user_role:'',
				user_group:[],
				zone_list:[],
				user_company:{},
				// 消息数量
				message_count:'',
				activity_list:[],
				announce_list: [],
				announce_cate:[],
				refresh:'',
				// 投诉转办对象
				status:[{
					key:1,
					val:'筹备阶级'
				},{
					key:2,
					val:'待审'
				},{
					key:3,
					val:'未开始'
				},{
					key:4,
					val:'进行中'
				},{
					key:5,
					val:'暂停'
				},{
					key:6,
					val:'终止'
				},{
					key:7,
					val:'结束'
				}]
			}
		},
		watch:{
			user_role:{
				handler(val,oldVal) {
					if(val !== oldVal && this.user_info.hasOwnProperty('id') && this.active_city.hasOwnProperty('china_code')){
						this.getZoneList()
					}
				}
			},
			active_city:{
			    handler(val,oldVal) {
					if(!val.hasOwnProperty('china_code') && this.user_info.hasOwnProperty('id')){
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								title: '请选择区域！'
							})
							this.chooseCityFunc()
						},1000)
					}else if(val.china_code !== oldVal.china_code){
						this.refresh = val.china_code
						//如果有用户组，城市改变后刷新，
						//当没有用户组时，设置默认用户组
						if(!this.user_group.hasOwnProperty('id') || oldVal.china_code){
							getUserGroup().then(res=>{
								if(res.data.length>0){
									this.user_group  = res.data[0]
								}else{
									this.user_group ={}
								}								
								this.utils.setUser('groups',this.user_group)
							})
						}
						//如果有默认小区，城市改变后刷新，如果没有默认小区，则拉取默认小区。
						if(!this.active_zone.hasOwnProperty('id') || oldVal.china_code){
							this.getZoneList()
						}
					}
			    }
			},
			active_zone:{
				handler(val,oldVal){
					if(val.id !== oldVal.id && this.user_info.hasOwnProperty('id')){
						this.refresh = val.id;
					}
				}
			},
			refresh:{
				handler(val,oldVal){
					//当城市、用户组变化时，拉取数据。
					if(val!==oldVal && this.user_info.hasOwnProperty('id') && this.active_city.hasOwnProperty('china_code')){
						this.getAnnounceCate()
						this.getAnnounceList()
						this.getOngoingActivity()
					}
				}
			}
		},
		onShow() {
			//获取缓存用户信息，无则登录。
			// 获取缓存用户信息，无则登录。
			this.user_info = this.utils.getUser();
			setTimeout(()=>{
				this.user_role = this.utils.getUserRole();
				// 获取区域代码
				this.active_city = this.utils.getUserCity();
				// 获取用户组
				this.user_group = this.utils.getUserGroups();
				this.active_zone = this.utils.getUserZone();
				this.user_company = this.utils.getUserCompany();
				if(Object.keys(this.active_city).length>0){
					this.getNewMessageNumber()
				}
			},500)
		},
		onLoad() {
			//显示导航
			uni.showTabBar()
		},
		methods: {
			// 刷新小区
			getZoneList(){
				let data = {
					page: 1,
					per_page: 1,
					china_code: this.active_city.china_code
				}
				if(this.user_role=='user'){
					getZoneMe(data).then(res=>{
						if(res.data.length>0){
							this.active_zone = res.data[0]
						}else{
							this.active_zone = {}
						}
						this.utils.setUser('zone',this.active_zone)
					})
				}else{
					data.cert_id = this.user_company.id
					getZoneCom(data).then(res=>{
						if(res.data.length>0){
							this.active_zone = res.data[0]
						}else{
							this.active_zone = {}
						}
						this.utils.setUser('zone',this.active_zone)
					})
				}
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
				}
				if(page.num==1){
					this.zone_list =[]
				}
				if(this.user_role=='user'){
					data.china_code = this.active_city.china_code
					getZoneMe(data).then(res=>{
						this.zone_list =  this.zone_list.concat(res.data)
						this.mescroll.endSuccess(this.zone_list.length);
					}).catch(err=>{
						this.mescroll.endSuccess(0);
					})
				}else{
					data.cert_id = this.user_company.id
					getZoneCom(data).then(res=>{
						this.zone_list =  this.zone_list.concat(res.data)
						this.mescroll.endSuccess(this.zone_list.length);
					}).catch(err=>{
						this.mescroll.endSuccess(0);
					})
				}
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			// 跳转
			goSwitchFunc(url,auth=true){
				if(Object.keys(this.active_zone).length==0 && auth==true){
					uni.showToast({
						icon:'none',
						title:'请先选择小区！',
						mask:true
					})
					setTimeout(()=>{
						this.chooseZoneFunc()
					},1000)
					return false
				}
				uni.switchTab({
					url: url
				})
			},
			// 跳转
			goPagesFunc(url,auth=true){
				if(Object.keys(this.active_zone).length==0 && auth==true){
					uni.showToast({
						icon:'none',
						title:'请选择小区！',
						mask:true
					})
					setTimeout(()=>{
						this.chooseZoneFunc()
					},1000)
					return false
				}
				this.utils.route(`${url}?id=${this.active_zone.id}&opt=${encodeURIComponent(JSON.stringify(this.active_zone))}`)
			},
			// 选择了小区
			chooseFuncZone(obj){
				this.utils.setUser('zone',obj)
				this.active_zone = obj
				this.$refs.popup.close()
			},
			// 弹窗控制tabbar
			changeFuncPopup(obj){
				if(obj.show){
					uni.hideTabBar()
					return false
				}
				uni.showTabBar()
			},
			// 打开弹窗去选择当前房屋
			chooseZoneFunc(){
				this.utils.isVerify()
				if(!this.active_city){
					uni.showToast({
						icon:'none',
						title:'请先选择区域！',
						mask:true
					})
					setTimeout(()=>{
						this.chooseCityFunc()
					},1000)
					return false
				}
				// 打开弹窗
				this.$refs.popup.open()
			},
			//去选择城市
			chooseCityFunc(){
				uni.navigateTo({
					url:"/pages/page/choosecity/choosecity"
				})
				//this.$refs.ber_picker_city.open(arr)
			},
			// 扫描二维码权限
			scanFunc() {
				// #ifdef APP-PLUS
				let _this = this;
				if (uni.getSystemInfoSync().platform == 'ios') {
					if(permision.judgeIosPermission("camera")){
						_this.handleScanFunc()
					}else{
						permision.gotoAppPermissionSetting();
					}
				}else if(uni.getSystemInfoSync().platform == 'android'){
					permision.requestAndroidPermission("android.permission.CAMERA").then(res=>{
						if(res>0){
							_this.handleScanFunc()
						}else{
							permision.gotoAppPermissionSetting();
						}
					})
				}
				// #endif
				// #ifndef APP-PLUS
				uni.showToast({
					icon:'none',
					title:'请在手机端使用！',
					mask:true
				})
				// #endif
			},
			// 扫描二维码
			handleScanFunc(val){
				uni.scanCode({
					success: function (res) {
						console.log(res)
					}
				});
			},
			// 获取新消息的数量
			getNewMessageNumber() {
				let data = {
					page: 1,
					per_page:100,
					isread: 0,
				}
				getMessageList(data).then(res=>{
					let total = res.data.length
					this.message_count = total;
					// #ifdef APP-PLUS
					if (total > 0) {
						let payload = {
							"localmsg": true,
							"text": "您有" + total + "条消息未读，立即查看。",
							"page": "tabbar/chat/view/index",
						}
						const value = uni.getStorageSync('messageTatal'); //记录消息条数。
						if (value == 0) { //只有为空时或有新消息之后才提示。
							plus.push.createMessage(payload.text, JSON.stringify(payload));
						}
					}
					uni.setStorageSync('messageTatal',total);
					plus.runtime.setBadgeNumber(total);
					// #endif
				})
			},
			// 获取进行中的议事
			getOngoingActivity() {
				let data = {
					page:1,
					per_page:3,
					can_type:2
				}
				getSurveyList(data).then(res=>{
					this.activity_list = res.data
				})
			},
			// 跳转到活动详情页，并传递活动id
			toSurveyDetail(id){
				this.utils.route('/pages/survey/detail/detail?id='+id)
			},
			// 公示分类
			getAnnounceCate(){
				getAnnounceKind('announce').then(res=>{
					this.announce_cate = res.data
				})
			},
			// 获取公示列表
			getAnnounceList() {
				let data = {
					page: 1,
					per_page: 3,
					status_many:'3,4,7',
				}
                if(this.active_zone.id) {
                    data.tovalcan = this.active_zone.id
					getAnnounceList(data).then(res=>{
						this.announce_list = res.data
					})
                }				
			},
			//公示详情
			toAnnounceDetails(id){
				this.utils.route('/pages/announce/detail/detail?id='+id)
			},
			// 查看更多
			toMore(type){
				if(type === "announce") {
					uni.switchTab({
						url: '/pages/announce/list/list'
					})
				}else {
					uni.switchTab({
						url: '/pages/survey/list/list'
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.header{
		background: linear-gradient(-90deg, #00b7bd, #00d5c0);
		padding-top: 50rpx;
		border-radius: 0 0 40rpx 40rpx;
	}
	.headerbar{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 5%;
	}
	.headerbar-city{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size:$uni-font-size-base;
		color:$uni-text-color-white;
		image{
			width:26rpx;
			height:31rpx;
		}
		text{
			padding-left: 10rpx;
		}
	}
	.headerbar-tools{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		image{
			width:48rpx;
			height:48rpx;
		}
		.tool-item{
			padding: 10rpx;
		}
		.message{
			position: relative;
		}
	}
	.zone{}
	.zone-title{
		margin:0 5%;
		height: 90rpx;
		overflow: hidden;
		box-sizing: border-box;
		background-color: $uni-text-color-white;
		border-radius:$uni-border-radius-base;
		display: flex;
		justify-content: center;
		align-items: center;
		text{
			line-height:45rpx;
			font-size:$uni-font-size-lg;
			color: $uni-theme-primary;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			padding: 0 10rpx;
		}
		image{
			width:12rpx;
			height:20rpx;
			transform:rotate(-90deg);
			-ms-transform:rotate(-90deg);
			-moz-transform:rotate(-90deg);
			-webkit-transform:rotate(-90deg);
			-o-transform:rotate(-90deg);
		}
	}
	.zone-menu{
		padding:30rpx 5% 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content:space-between;
		align-items: center;
		image{
			width:90rpx;
			height:90rpx;
		}
		text{
			font-size:$uni-font-size-base;
			color: $uni-text-color-white;
		}
		.zone-menu-item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.zone-menu-item:hover{
			border-radius:$uni-border-radius-base;
		}
	}
	.poster{
		display: flex;
		justify-content: center;
		margin-top: -60rpx;
		padding-bottom:30rpx;
		padding-top:50rpx;
		image{
			opacity:0;
			width:60%;
		}
	}
	.zmenu{
		padding: 20rpx 0;
	}
	.zmenu-item{
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		image{
			width:99rpx;
			height:99rpx;
		}
		text{
			font-weight: normal;
			font-size:$uni-font-size-base;
		}
	}
	.notice{
		display: flex;
		align-items: center;
		background-color:$uni-bg-color-2;
		border-radius:$uni-border-radius-base;
		margin: 20rpx 5%;
		padding:30rpx;
		box-sizing: border-box;
		.notice-icon{
			display: flex;
			align-items: center;
			padding-right:20rpx;
			image{
				width:60rpx;
				height: 60rpx;
			}
		}
		.notice-text{
			flex: 1;
			font-size:$uni-font-size-base;
			width: 100%;
			line-height:150%;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}
	
	.zdiscuss-head{
		margin-bottom:30rpx;
		.zdiscuss-head-item{
			background-color: $uni-bg-color-white;
			border-radius:$uni-border-radius-base;
			display: flex;
			align-items: center;
			justify-content: center;
			padding:30rpx 20rpx;
			box-sizing: border-box;
			.label-icon{
				width:50rpx;
				height:50rpx;
				padding:16rpx;
				border-radius:50%;
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width:80%;
				}
			}
			.label-text{
				display: flex;
				flex-direction: column;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
				padding-left:20rpx;
				.label-text-tit{
					font-size: $uni-font-size-base;
					font-weight: 800;
				}
			}
		}
		.important{
			margin-right:15rpx;
		}
		.important .label-text-tit{
			color:$uni-theme-danger;
		}
		.important .label-icon{
			background-color:#f57f7f;
		}
		.unimportance{
			margin-left:15rpx;
		}
		.unimportance .label-icon{
			background-color:$uni-theme-secondary;
		}
		.unimportance .label-text-tit{
			color:$uni-theme-primary;
		}
	}
	.zdiscuss-body{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.zdiscuss-cate{
			background-color: #e1f6f4;
			color: $uni-theme-primary;
			font-size: $uni-font-size-base;
			border-radius:$uni-border-radius-base;
			width:60rpx;
			text-align: center;
			line-height: 40rpx;
			padding: 30rpx;
		}
		.zdiscuss-info{
			display: flex;
			flex-direction: column;
			.text{
				// height: 100rpx;
				width: 100%;
				line-height: 150%;
				font-size: $uni-font-size-lg;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}
		}
	}
	.announce-head{
		margin-bottom:30rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		.announce-head-item{
			background-color: $uni-bg-color-white;
			margin-right:30rpx;
			border-radius:$uni-border-radius-base;
			padding:20rpx 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 30rpx;
			}
			text{
				padding-left:15rpx;
				font-size: $uni-font-size-base;
				color:$uni-theme-primary;
				white-space: nowrap;
			}
		}
	}
	.announce-body{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.announce-cate{
			background-color: #e1f6f4;
			color: $uni-theme-primary;
			font-size: $uni-font-size-base;
			border-radius:$uni-border-radius-base;
			width:60rpx;
			text-align: center;
			line-height: 40rpx;
			padding: 30rpx;
		}
		.announce-info{
			display: flex;
			flex-direction: column;
			.text{
				width: 100%;
				font-size: $uni-font-size-lg;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}
		}
	}
	.active{
		color: $uni-theme-primary;
	}
</style>
