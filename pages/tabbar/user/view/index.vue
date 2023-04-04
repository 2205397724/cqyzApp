<template>
    <view class="bg-white">
		<surplus-hair></surplus-hair>
		<view class="top-setting flex-row flex-end">
			<view @tap="tosetting()">
				<image src="/static/icon/settings@2x.png" mode="widthFix"></image>
			</view>
		</view>
        <mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
            <uni-row class="user-head">
				<uni-col :span="5" class="flex-row flex-center">
					<image class="user-avatar" :src="user_info.avatarUrl" @click="previewImage"></image>
				</uni-col>
				<uni-col :span="16">
					<view class="user-name" v-if="user_info">
						<view class="strong" @tap="toprofile()">
							<safe-str style="width: auto;" size="38rpx" type="name" :str="user_info.username" :show="true"></safe-str>
						</view>
						<view class="user-info">
							<text>{{user_info.nickname || user_info.name || user_info.username}}</text>
							<text class="na-tag1 m-l-20" @click="changeIdenty" v-if="role=='user'">个人</text>
							<text class="na-tag2 m-l-20" @click="changeIdenty" v-else>企业</text>
						</view>
					</view>
					<view v-else class="strong size-lg p-l-20">
						<ber-route url="/pages/page/login/login">请登录</ber-route>
					</view>
				</uni-col>
				<uni-col :span="3" class="align-right">
					<image class="user-qr-code" src="/static/icon/qr-code@2x.png"></image>
				</uni-col>
			</uni-row>
			<uni-row class="user-score">
				<uni-col :span="8" class="score-item">
					<text class="num">{{user_info.integral || 0}}</text>
					<text>积分</text>
				</uni-col>
				<uni-col :span="8" class="score-item">
					<text class="num">100</text>
					<text>信誉</text>
				</uni-col>
				<uni-col :span="8" class="score-item">
					<text class="num">0</text>
					<text>经验</text>
				</uni-col>
			</uni-row>
			<view class="user-house">
				<view>
					<ber-route class="house-yes" url="/pages/mine/house/house">
						<text class="font-primary">我的房屋</text>
					</ber-route>
				</view>
			</view>
			<view class="na-box na-main">
				<view class="na-title">
					<text class="text">我的功能</text>
				</view>
				<view class="user-tools">
					<ber-route class="tools-item" url="/pages/mine/house/house">
						<image src="/static/user/ic_house.png" mode="widthFix"></image>
						<text>我的房屋</text>
					</ber-route>
					<!-- <ber-route class="tools-item">
						<image src="/static/user/ic_costs.png" mode="widthFix"></image>
						<text>我的缴费</text>
					</ber-route>
					<ber-route class="tools-item">
						<image src="/static/user/ic_download.png" mode="widthFix"></image>
						<text>我的下载</text>
					</ber-route> -->
					<ber-route class="tools-item" url="/pages/mine/company/company">
						<image src="/static/user/ic_joins.png" mode="widthFix"></image>
						<text>我的企业</text>
					</ber-route>
					<ber-route class="tools-item" url="/pages/mine/profile/profile">
						<image src="/static/user/ic_me.png" mode="widthFix"></image>
						<text>我的资料</text>
					</ber-route>
				</view>
			</view>
			<view class="na-box na-main">
				<view class="na-title">
					<text class="text">客服服务</text>
				</view>
				<uni-row class="user-service">
					<uni-col :span="6">
						<image src="/static/user/service.png" mode="widthFix"></image>
					</uni-col>
					<uni-col :span="18">
						<view>客户服务热线，工作日8:00-18:00</view>
						<view class="phone">
							<safe-str class="phone-number" size="38rpx" type="tel" :str="hotline" :show="true" :dial="true" :isHide="false"></safe-str>
						</view>
					</uni-col>
				</uni-row>
			</view>
        </mescroll-body>
        <uni-popup ref="popup" type="top">
        	<view class="font-grey size-base border-b-grey p-b-20">选择您的企业</view>
        	<view class="flex-row flex-center flex-between p-tb-30 border-b-grey" v-for="item in companyList" :key="item.id">
        		<view>{{item.com_name}}</view>
    			<view @click="chooseCompany(item)">
                    <!-- <uni-icons type="checkbox" size="30" :color="item.id==active_zone.id?'#00a292':'f1f1f1'"></uni-icons> -->
                    <uni-icons type="checkbox" size="28" :color="item.id==company.id?'#00a292':'f5f5f5'"></uni-icons>
        		</view>
        	</view>
        </uni-popup>
    </view> 
</template>
<script>
	
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {USER_INFO,ROLE} from "@/pages/framework/config/cache.js"
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getUserMessage,
        getCompanyList
	} from '../service/api.js'
	import {VITE_APP_FOLDER_SRC,URL_LOGO} from '@/pages/framework/config/app.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				user_info: {},
                role:'',
                company:{id:''},
                companyList:[],
				hotline : '023-58626020'
			}
		},
		onShow() {
			this.role = this.utils.getUserRole()
            this.company = this.utils.getUserCompany()
			let region = this.utils.getUserCity()
			if(region.hasOwnProperty('extra') && region.extra){
				this.hotline = region.extra.hotline
			}
			uni.showTabBar()
		},
		onLoad() {
		},
		methods: {
            // 切换身份
            changeIdenty() {
				let _this = this
                if(this.role == 'user') {
					uni.showModal({
						title: '切换身份',
						content: `确定要切换为【企业】身份吗？`,
						success: function(res) {
							if (res.confirm) {
								let data = {
									page:1,
									per_page:500
								}
								getCompanyList(data).then(res=>{
									if(res.data.length>0){
										// 从用户切换到企业身份需要选择企业
										_this.$refs.popup.open()
										_this.companyList = res.data
										//设置第一个为默认企业
										if(Object.keys(_this.company).length==0){
											_this.utils.setUser('company',res.data[0])
											_this.company = res.data[0]
										}
										//设置企业身份
										_this.utils.setUser('role','company')
										_this.role = 'company'
									}else{
										uni.showToast({
											icon:"error",
											title:"未找到企业"
										})
									}
								})
							}
						}
					});
                }else {
					uni.showModal({
						title: '切换身份',
						content: `确定要切换为【个人】身份吗？`,
						success: function(res) {
							if (res.confirm) {
								_this.utils.setUser('role','user')
								_this.role = 'user'
							}
						}
					});
                }
            },
            chooseCompany(item) {
                this.utils.setUser('company',item)
				this.company = item
                this.$refs.popup.close()
            },
			/* 上拉加载的回调*/
			upCallback(page) {
				// this.user_info = this.utils.getUser()
				this.getInfo()
				this.mescroll.endSuccess(1)
			},
			getInfo() {
				getUserMessage().then(res=>{
					res.data.avatarUrl = res.data.avatar ? ( VITE_APP_FOLDER_SRC + res.data.avatar) : URL_LOGO
					this.user_info = res.data
					this.utils.setUser('info',res.data)
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			toprofile(){
				this.utils.route('/pages/mine/profile/profile')
			},
			tosetting(){
				this.utils.route('/pages/mine/setting/setting')
			},
			previewImage(){
				uni.previewImage({
					urls:[this.user_info.avatarUrl],
				});
			},
		}
	}
</script>
<style lang="scss" scoped>
	.user{
		background: linear-gradient(180deg, #f7ffff 10%, #ffffff 90%);;
	}
	.top-setting{
		padding-top:60rpx;
		padding-left: 5%;
		padding-right: 5%;
		display: flex;
		justify-content: flex-end;
		image{
			width: 40rpx;
			height: 40rpx;
			opacity: 0.4;
		}
	}
	.user-head{
		width: 100%;
		padding: 0 5%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
		.user-name{
			font-size: $uni-font-size-lg-x;
		}
		.user-info{
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			padding-top:10rpx;
			padding-right: 20rpx;
		}
	}
	.user-qr-code{
		width: 40rpx;
		height: 40rpx;
		opacity: 0.5;
	}
	.user-avatar{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.user-score{
		width: 100%;
		padding:40rpx 5%;
		box-sizing: border-box;
		font-size: $uni-font-size-base;
		color: $uni-text-color-grey;
		.score-item{
			display: flex;
			flex-direction: column;
			justify-content:center;
			align-items: center;
		}
		.num{
			font-size:$uni-font-size-lg-x;
			font-weight: 800;
			color: $uni-theme-primary;
		}
	}
	.user-house{
		padding:20rpx 5%;
		box-sizing: border-box;
		text{
			font-size: $uni-font-size-base;
			font-weight: 800;
		}
		.house-yes{
			padding:60rpx 60rpx;
			border-radius:$uni-border-radius-base;
			background-color:$uni-bg-color-1 !important;
			background-image:url(../../../../static/user/house-yes@3x.png);
			background-size:15%;
			background-repeat: no-repeat;
			background-position:80% bottom;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.num{
				font-size: $uni-font-size-lg-x;
				font-weight: 800;
				color: $uni-theme-primary;
			}
		}
		.house-no{
			padding:30rpx 60rpx;
			border-radius:$uni-border-radius-base;
			background-color:$uni-bg-color-2 !important;
			background-image:url(../../../../static/user/house-no@3x.png);
			background-size:20%;
			background-repeat: no-repeat;
			background-position:80% bottom;
			box-sizing: border-box;
			margin-left: 15rpx;
			display: flex;
			flex-direction: column;
			.num{
				font-size: $uni-font-size-lg-x;
				font-weight: 800;
				color: $uni-theme-extra;
			}
		}
	}
	.user-tools{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		.tools-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			image{
				width:56rpx;
			}
			text{
				padding-top:20rpx;
				font-size: $uni-font-size-base;
			}
		}
		.tools-item:hover{
			border-radius:$uni-border-radius-base;
		}
	}
	.user-service{
		padding: 30rpx;
		background-color:#f9f9f9;
		font-size: $uni-font-size-base;
		color:$uni-text-color-grey;
		border-radius:$uni-border-radius-base;
		display: flex;
		align-items: center;
		image{
			width: 100rpx;
		}
		.phone{
			font-size: $uni-font-size-lg;
			// font-weight: 800;
			color:$uni-text-color-darkgrey;
		}
        .phone-number {
            font-size: $uni-font-size-lg-x;
            font-weight: 500;
        }
	}
</style>
