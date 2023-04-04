<!-- 发布页面 -->
<template>
	<view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view>
				<headbar backgroundColor="rgba(255,255,255,0)" leftIcon="closeempty"></headbar>
			</view>
			<view class="na-main na-box">
				<view class="font-grey size-sm p-t-10 p-b-10">
					投诉报修
				</view>
				<view class="flex-row wrap bg-white border-radius-base p-30">
					<view class="zmenu-item" @click="goPagesFunc('/pages/complaint/add/add')" >
						<image src="/static/index/zmenu8@2x.png"></image>
						<text>发起投诉</text>
					</view>
					<view class="zmenu-item" @click="goPagesFunc('/pages/repair/add/add')" >
						<image src="/static/index/zmenu10@2x.png"></image>
						<text>发起报修</text>
					</view>
					<!-- <view class="zmenu-item" @click="" >
						<image src="/static/index/zmenu9@2x.png"></image>
						<text>违建举报</text>
					</view> -->
				</view>
				<!-- <view class="font-grey size-sm p-t-30 p-b-10" v-if="isYWH">
					事件活动
				</view>
				<view class="flex-row wrap bg-white border-radius-base p-30" v-if="isYWH">
					<view class="zmenu-item" @click="goPagesFunc('')" >
						<image src="/static/index/zmenu2@2x.png"></image>
						<text>发起专题</text>
					</view>
					<view class="zmenu-item" @click="goPagesFunc('/pages/survey/add/add')" >
						<image src="/static/index/zmenu11@2x.png"></image>
						<text>发起活动</text>
					</view>
				</view> -->
				<view class="font-grey size-sm p-t-30 p-b-10" v-if="isYWH">
					公示公开
				</view>
				<view class="flex-row wrap bg-white border-radius-base p-30" v-if="isYWH">
					<view class="zmenu-item" @click="goPagesFunc('/pages/announce/add/add')" >
						<image src="/static/index/zmenu1@2x.png"></image>
						<text>发布公示</text>
					</view>
				</view>
				<view class="font-grey size-sm p-t-30 p-b-10">
					房屋相关
				</view>
				<view class="flex-row wrap bg-white border-radius-base p-30">
					<view class="zmenu-item" @click="goPagesFunc('/pages/mine/house/house')" >
						<image src="/static/index/zmenu13@2x.png"></image>
						<text>我的房屋</text>
					</view>
                    <view class="zmenu-item" @click="goPagesFunc('/pages/share/history/history')" >
                    	<image src="/static/index/zmenu14@2x.png"></image>
                    	<text>水电气过户</text>
                    </view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>

import Cache from '@/pages/framework/utils/cache/cache.js'
import {REGION,ZONE} from '@/pages/framework/config/cache.js'
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
            },
			isYWH:false,
        }
    },
	onShow() {
		this.isYWH = this.utils.isYwh()
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
		// 跳转
		goPagesFunc(url){
			// uni.showToast({
			// 	icon:'none',
			// 	title:'先判断是否为业主！',
			// 	mask:true
			// })
			// this.utils.route(`${url}?opt=${encodeURIComponent(JSON.stringify(this.active_house))}`)
            this.utils.route(`${url}`)
		},
    }
}
</script>

<style lang="scss" scoped>
	.zmenu-item{
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		image{
			width:80rpx;
			height:80rpx;
			padding-bottom:16rpx;
		}
		text{
			font-weight: normal;
			font-size:$uni-font-size-base;
		}
	}
</style>

