<template>
    <view class="bg-white">
		<surplus-hair></surplus-hair>
		<view class="na-main p-t-40">
			<view class="size-lxx strong p-t-30">服务</view>
		</view>
        <mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			
			<view class="na-main p-t-40">
				<view class="na-card bg-light-grey flex-row flex-center size-base" style="height:270rpx;">
					商城幻灯片接口
				</view>
			</view>
			<view class="na-main p-tb-40">
				<view class="na-nav">
					<view class="na-nav-item active size-lg">
						<view class="menu">
							<text>热门商品</text>
						</view>
					</view>
					<view class="na-nav-item">
						<view class="menu">
							<text>热门服务</text>
						</view>
					</view>
				</view>
			</view>
			<view class="na-main">
				<scroll-view scroll-x="true" class="nowrap">
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
					<view class="na-card bg-light-grey m-r-20 inline-block goods-item">商品</view>
				</scroll-view>
			</view>
			<view class="na-main">
				<view class="na-title">
					<text class="text">便民服务</text>
				</view>
			</view>
			<view class="na-main">
				<view class="flex-row flex-center flex-between">
					<view>
						<view class="badge-lg badge-circle bg-light-green p-10"></view>
						<text class="font-darkgrey size-base p-t-20">服务名称</text>
					</view>
					<view>
						<view class="badge-lg badge-circle bg-light-green p-10"></view>
						<text class="font-darkgrey size-base p-t-20">服务名称</text>
					</view>
					<view>
						<view class="badge-lg badge-circle bg-light-green p-10"></view>
						<text class="font-darkgrey size-base p-t-20">服务名称</text>
					</view>
					<view>
						<view class="badge-lg badge-circle bg-light-green p-10"></view>
						<text class="font-darkgrey size-base p-t-20">服务名称</text>
					</view>
				</view>
			</view>
        </mescroll-body>
    </view>
</template>
<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
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
        }
    },
	onShow() {
		uni.showTabBar()
	},
    onLoad() {
		
    },
    methods: {
        /* 上拉加载的回调*/
        upCallback(page) {
            this.mescroll.endSuccess(1)
        },
        // 下拉刷新回调
        downCallback() {
            this.mescroll.resetUpScroll()
        },
        // // 扫描二维码
        // scanFunc() {
        //     console.log('123')
        // },
        // // 通知
        // noticeFunc() {
        //     console.log('312')
        //     uni.$u.route('/pages/login/login')
        // }
    }
}
</script>
<style lang="scss" scoped>
	.goods-item{
		width: 300rpx;
		height: 400rpx;
		text-align: center;
		font-size: $uni-font-size-base;
		line-height: 400rpx;
	}
</style>
