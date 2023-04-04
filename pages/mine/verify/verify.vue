<!-- 我的实名认证页 -->
<template>
	<view class="">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar backgroundColor="transparent"></headbar>
			<view class="na-main">
				<text class="size-lx strong">实名认证</text>
			</view>
			<view class="na-main p-tb-30" v-if="opts_all.status_cert&&opts_all.status_cert[2]&&user_info.status_cert == opts_all.status_cert[2].key">
				<view class="na-card bg-white p-40">
					<view class="flex-row flex-center flex-between">
						<view class="">
							<view class="size-sm font-grey p-tb-10">姓名</view>
							<!-- <view class="size-lg strong p-tb-10">{{user_info.name.substring(0,1) + '*'.repeat(user_info.name.length-1)}}</view> -->
                            <safe-str class="size-lg strong p-tb-10" type="name" :str="user_info.name" :show="true"></safe-str>
							<view class="size-sm font-grey p-tb-10">身份证</view>
							<!-- <view class="size-lg strong p-tb-10">{{user_info.id_card.substring(0,6) + '*'.repeat(8)+user_info.id_card.substring(14,18)}}</view> -->
                            <safe-str class="size-lg strong p-tb-10" size="38rpx" type="name" :str="user_info.id_card" :show="true"></safe-str>
						</view>
						<view class="badge-base badge-success"></view>
					</view>
				</view>
			</view>
			<view class="na-main p-t-30" v-else>
				<view class="na-title-sm">快速认证</view>
				<!--首次实名认证时方式1、2都可用，再次实名认证只能是方式2 -->
				<view class="p-tb-30">
					<view class="flex-row flex-center flex-between size-base">
						<text>方式1：</text>
						<view class="p-r-30 line-height-100">
							<ber-route class="drop-right-lg font-primary" url="/pages/mine/verify_mode_1/view/index">输入证件号码</ber-route>
						</view>
					</view>
				</view>
				<view class="p-tb-30">
					<view class="flex-row flex-center flex-between size-base">
						<text>方式2：</text>
						<view class="p-r-30 line-height-100">
							<ber-route class="drop-right-lg font-primary" url="/pages/mine/verify_mode_2/view/index">上传证件照片</ber-route>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import Cache from "@/pages/framework/utils/cache/cache.js"
import {USER_INFO} from "@/pages/framework/config/cache.js"
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
			user_info:{},
            // 下拉刷新的配置(可选, 绝大部分情况无需配置)
            downOption: {
                native: true
            },
            // 上拉加载的配置(可选, 绝大部分情况无需配置)
            upOption: {
                noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
            },
			opts_all:{
				status_cert:[]
			},
        }
    },
	onShow() {
		this.user_info = this.utils.getUser()
		getOpts(['status_cert']).then(res => {
		    this.opts_all = res
		})
	},
    methods: {
        /* 上拉加载的回调*/
        upCallback(page) {
            this.mescroll.endSuccess(1)
        },
        // 下拉刷新回调
        downCallback() {
            this.mescroll.resetUpScroll()
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
