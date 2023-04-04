<template>
	<view class="content">
		<view class="na-header-white">
			<headbar title="账号注销"></headbar>
		</view>
        <view class="na-main">
            <!-- 注销注意信息 -->
            <view v-if="active==0">
				<view class="font-grey size-base p-b-30">1、请认证阅读提示信息</view>
				<view class="size-base bg-white p-30 na-card">
					<view class="size-lg strong align-center p-30">
						注销提示
					</view>
					<view class="m-tb-10">
						<view class="p-10">
							<text class="line-height-180">1、账号注销会删除个人姓名、手机等实名认证信息，同时终止本APP应用内的所有业务使用权和服务享受权，账号将停止使用并自动退出登录；</text>
						</view>
					</view>
					<view class="m-tb-10">
						<view class="p-10">
							<text class="line-height-180">2、账号注销后，账号使用人曾行使过的权利（包含但不限于表决、投票、留言、投诉）痕迹将会被保留，也会成为小区事务决策的重要参考依据，但优先等级最弱；</text>
						</view>
					</view>
					<view class="m-tb-10">
						<view class="p-10">
							<text class="line-height-180">3、您同样可以重新注册账号且实名认证后继续使用我们的应用。</text>
						</view>
					</view>
				</view>
				<button @tap="step_click(1)" class="login-button m-t-30" type="primary" :disabled="step_num>0">{{ step_num > 0 ? '阅读倒计时 '+step_num+' S' : '下一步'}}</button>
            </view>
            <view v-if="active==1">
                <view class="font-grey size-base p-b-30">2、请核对账户信息</view>
                <view class="bg-white p-30 userInfo na-card">
                    <view class="flex-row flex-center flex-between size-base">
                        <text>头像</text>
                        <image class="badge-lg badge-circle" :src="user_info.avatarUrl"></image>
                    </view>
                    <view class="flex-row flex-center flex-between size-base">
                        <text>姓名</text>
                        <view class="font-darkgrey">{{user_info.name}}</view>
                    </view>
                    <view class="flex-row flex-center flex-between size-base">
                        <text>昵称</text>
                        <view class="font-darkgrey">{{user_info.nickname}}</view>
                    </view>
                    <view class="flex-row flex-center flex-between size-base">
                        <text>性别</text>
                        <view class="font-darkgrey">{{getFuncOptVal(opts_all.gender,user_info.gender) }}</view>
                    </view>
                    <view class="flex-row flex-center flex-between size-base">
                        <text>手机</text>
                        <view class="font-darkgrey">{{user_info.mobile}}</view>
                    </view>
                    <view class="flex-row flex-center flex-between size-base">
                        <text>注册时间</text>
                        <view class="font-darkgrey">{{user_info.created_at}}</view>
                    </view>
                </view>
            	<view class="font-extra size-sm p-tb-30">提示：不能注销他人账号</view>
            	<button @tap="cancellClick" class="login-button" type="primary">确定注销</button>
            </view>
            <view class="p-40" v-if="active==2">
            	<view class="align-center">
                    <image class="img" src="../../../static/icon/success@2x.png" mode="widthFix"></image>
            		<view class="font-primary size-base">注销成功</view>
            	</view>
            	<button @tap="step_click(3)" class="login-button" type="primary">完成</button>
            </view>
        </view>
	</view>
</template>
<script>
	import utils from '@/common/utils'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
    import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
    import {
        deleteUser,
    } from './service/api.js'
	export default {
		data() {
			return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				active:0,
				step_num :10,
                user_info:{},
                opts_all:{},
			};
		},
		onLoad() {
            this.user_info = this.utils.getUser()
            getOpts(['gender']).then(res => {
                this.opts_all = res
            })
			let countdown = setInterval(()=>{
				if(this.step_num>0){
					this.step_num--	
				}
			}, 1000)
		},
		methods:{
            getFuncOptVal(arr,key){
            	return getOptVal(arr,key)
            },
			//步骤
			step_click(n){
				this.active = n;
				//完成并退出
				if(n==3){
					uni.clearStorageSync();
					uni.showToast({
						icon: 'success',
					    title: '完成注销',
						mask: true,
					    duration: 1200,
						success: ()=>{
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/page/login/login'
								});
							}, 1200);
						}
					});
				}
			},
			// 注销方法
			cancellClick() {
                uni.showModal({
                	title: '安全提示',
                	content: '确定注销该账户吗？',
                	success:  res => {
                		if (res.confirm) {
                            this.step_click(2)
                            deleteUser('mbr',this.user_info.id).then(res=>{
                                this.step_click(2)
                            })
                		} else if (res.cancel) {
                			console.log('用户点击取消');
                		}
                	}
                });
			},
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo {
        view {
            margin: 20rpx 0;
        }
    }
    .img {
        width:160rpx;
    }
</style>
