<!-- 设置页面 -->
<template>
	<view class="bg-white">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar></headbar>
			<view class="na-main p-tb-30">
				<text class="size-lx strong">设置</text>
			</view>
			<view class="na-main">
				<!-- <view class="p-tb-30">
					<ber-route url="/pages/mine/change/change" class="flex-row flex-center flex-between">
						<text class="size-base">修改个人资料</text>
						<view class="p-r-30 line-height-100">
							<view class="drop-right-lg"></view>
						</view>
					</ber-route>
				</view> -->
				<!-- <view class="p-tb-30">
					<view class="flex-row flex-center flex-between">
						<text class="size-base">关于我们</text>
						<view class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg"></view>
						</view>
					</view>
				</view> -->
				<view class="p-tb-30"  @click="goAgree()">
					<view class="flex-row flex-center flex-between">
						<text class="size-base">用户协议</text>
						<view class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg"></view>
						</view>
					</view>
				</view>
				<view class="p-tb-30" @click="goTerm()">
					<view class="flex-row flex-center flex-between">
						<text class="size-base">隐私政策</text>
						<view class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg"></view>
						</view>
					</view>
				</view>
				<!-- <view class="p-tb-30" @click="clickFuncLogout">
					<view class="flex-row flex-center flex-between">
						<text class="size-base">退出登录</text>
						<view class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg"></view>
						</view>
					</view>
				</view> -->
                <view class="p-tb-30" @click="goUserCancell()">
                	<view class="flex-row flex-center flex-between">
                		<text class="size-base">账号注销</text>
                		<view class="p-r-30 line-height-100">
                			<view class="font-darkgrey drop-right-lg"></view>
                		</view>
                	</view>
                </view>
				<view class="p-tb-30">
					<view class="flex-row flex-center flex-between" @click="clearStorage">
						<text class="size-base">清除本地缓存</text>
						<view class="font-darkgrey line-height-100"></view>
					</view>
				</view>
			</view>
            <view class="na-main" @click="clickFuncLogout">
                <text class="btn-extra btn-block btn-size-sm">退出登录</text>
            </view>
		</mescroll-body>
	</view>
</template>

<script>

	import Cache from '@/pages/framework/utils/cache/cache.js'
	import {
		TOKEN,
		UID,
		EXPIRES_TIME,
		USER_INFO,
		LOGIN_TEL,
		REGION,
		ZONE
	} from '@/pages/framework/config/cache.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {
					native: true
				},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				}
			}
		},
		onLoad() {
			// this.downCallback()
		},
		methods: {
            // 注销页面
            goUserCancell() {
                this.utils.route(`/pages/mine/user_cancell/user_cancell`)
            },
			/* 上拉加载的回调*/
			upCallback(page) {
				this.mescroll.endSuccess(1)
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			// 隐私政策
			goTerm() {
				this.utils.jumpWebpage('https://app.cqyezhuapp.com/privacy.html')
			},
			// 用户协议
			goAgree() {
				this.utils.jumpWebpage('https://app.cqyezhuapp.com/agreement.html')
			},
			clickFuncLogout(){
				uni.showModal({
					title: '退出',
					content: '确定要退出登录么！',
					success: function (res) {
						if (res.confirm) {
							Cache.clear(EXPIRES_TIME)
							Cache.clear(TOKEN)
							Cache.clear(USER_INFO)
							uni.showToast({
								icon: 'none',
								title: '成功退出，即将返回登录界面！',
								duration: 2000,
								mask:true
							})
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/page/login/login'
								});
							},2000)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			clearStorage() {
				uni.showModal({
					content: '确定要清楚本地缓存么！',
					success: function (res) {
						if (res.confirm) {
							Cache.clear(REGION)
							Cache.clear(ZONE)
							uni.showToast({
								icon: 'none',
								title: '清除成功！',
								duration: 2000,
								mask:true
							})
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/tabbar/index/view/index'
								});
							},2000)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
