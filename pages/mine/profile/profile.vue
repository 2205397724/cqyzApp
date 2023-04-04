<!-- 我的资料页 -->
<template>
	<view class="bg-white">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar fixed></headbar>
			<view class="na-main p-tb-30">
				<text class="size-lx strong">我的资料</text>
			</view>
			<view class="na-main">
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>头像</text>
						<ber-route url="/pages/mine/change/change" class="p-r-30 line-height-100">
							<view class="drop-right-lg">
								<image class="badge-lg badge-circle" :src="user_info.avatarUrl"></image>
							</view>
						</ber-route>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>昵称</text>
						<ber-route url="/pages/mine/change/change" class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg">{{user_info.nickname}}</view>
						</ber-route>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>性别</text>
						<ber-route url="/pages/mine/change/change" class="p-r-30 line-height-100" v-if="user_info">
							<!-- <view class="font-darkgrey drop-right-lg">{{getFuncOptVal(opts_all.gender,user_info.user.gender) }}</view> -->
							<view class="font-darkgrey drop-right-lg">{{getFuncOptVal(opts_all.gender,user_info.gender) }}</view>
						</ber-route>
					</view>
				</view>
				<!-- <view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>生日</text>
						<ber-route url="/pages/mine/change/change" class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg">1999-12-5</view>
						</ber-route>
					</view>
				</view> -->
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>手机</text>
						<ber-route url="/pages/mine/change_phone/change_phone" class="p-r-30 line-height-100"  v-if="user_info">
							<!-- <view class="font-darkgrey drop-right-lg">{{user_info.user.mobile}}</view> -->
							<view class="font-darkgrey drop-right-lg">{{user_info.mobile}}</view>
						</ber-route>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>登录密码</text>
						<ber-route url="/pages/mine/change_password/change_password" class="p-r-30 line-height-100"  v-if="user_info">
							<view class="font-darkgrey drop-right-lg">********</view>
						</ber-route>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>身份认证</text>
						<view class="p-r-30 line-height-100"  v-if="user_info">
							<!-- <ber-route url="/pages/mine/verify/verify" class="font-primary drop-right-lg">{{getFuncOptVal(opts_all.status_cert,user_info.user.status_cert) }}</ber-route> -->
							<ber-route url="/pages/mine/verify/verify" class="font-primary drop-right-lg">{{getFuncOptVal(opts_all.status_cert,user_info.status_cert) }}</ber-route>
						</view>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>企业认证</text>
						<ber-route url="/pages/mine/verify_mode_3/verify_mode_3" class="p-r-30 line-height-100">
							<view class="font-darkgrey drop-right-lg"></view>
						</ber-route>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>用户组</text>
						<view class="font-darkgrey line-height-100">业主</view>
					</view>
				</view>
				<view class="p-tb-40">
					<view class="flex-row flex-center flex-between size-base">
						<text>注册时间</text>
						<view class="font-darkgrey line-height-100">{{user_info.created_at}}</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
            VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
			user_info:{user:{}},
			opts_all:{},
            // 下拉刷新的配置(可选, 绝大部分情况无需配置)
            downOption: {
                native: true
            },
            // 上拉加载的配置(可选, 绝大部分情况无需配置)
            upOption: {
                noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
            },
        }
    },
	onShow() {
		this.user_info = this.utils.getUser()
	},
    onLoad() {
		getOpts(['gender', 'status_cert']).then(res => {
		    this.opts_all = res
			this.opts_all.status_cert = [{
				key: 10,
				val: '未认证'
			}, {
				key: 15,
				val: '认证处理中'
			}, {
				key: 20,
				val: '认证成功'
			}, {
				key: 30,
				val: '认证失败'
			}];
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
        },
		getFuncOptVal(arr,key){
			return getOptVal(arr,key)
		},
    }
}
</script>

<style lang="scss" scoped>

</style>
