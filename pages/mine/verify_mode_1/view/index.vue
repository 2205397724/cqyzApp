<!-- 实名认证方式1 -->
<template>
	<view class="">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar backgroundColor="transparent"></headbar>
			<view class="na-main">
				<view class="size-lx strong">身份验证</view>
				<view class="size-sm font-grey p-t-10">仅限于验证您的真实业主身份，验证成功后系统自动匹配到您的房屋信息，绑定房屋后可体验更多线上便捷服务，同时我们将对您的认证信息严格保密。</view>
			</view>
			<view class="na-main p-tb-30">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-align="center" :border="true">
					<uni-forms-item name="realname" style="border-style: none;">
						<uni-easyinput class="na-input" type="text" v-model="formData.realname" placeholder="请输入姓名" :inputBorder="false" maxlength="11"/>
					</uni-forms-item>
					<uni-forms-item name="idcard" style="border-style: none;">
						<uni-easyinput class="na-input" type="idcard" v-model="formData.idcard" placeholder="请输入证件号码" :inputBorder="false" maxlength="18"/>
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="na-main">
				<button type="primary" @click="clickFunc">提交</button>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import { putUserInfo,getUserInfo } from '../service/api.js'
import { USER_INFO,UID } from '@/pages/framework/config/cache.js'
import {VITE_APP_FOLDER_SRC,URL_LOGO} from '@/pages/framework/config/app.js'
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
			// 表单数据
			formData: {
				realname: '',
				idcard: '',
			},
			rules: {
				realname: {
					validateTrigger: 'bind',
					rules: [{
							required: true,
							errorMessage: '请输姓名',
						},
						{
							errorMessage: '请输入正确的姓名！',
						}
					]
				},
				idcard: {
					validateTrigger: 'bind',
					rules: [{
						required: true,
						errorMessage: '请输入证件号码',
					}]
				}
			}
        }
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
		clickFunc(){
			let params = {
				"name": this.formData.realname,
				"id_card":this.formData.idcard
			}
			let _this = this
			uni.showModal({
				title: '提示',
				content: `确定提交吗？此方式认证不能完全代替实名认证！`,
				success() {
					putUserInfo(params).then(()=>{
						uni.showToast({
							icon:'success',
							title:'提交成功'
						})
						getUserInfo().then(user_info=>{
							let data = user_info.data
							data.avatarUrl = data.avatar ? VITE_APP_FOLDER_SRC + data.avatar : URL_LOGO
							_this.utils.setUser('info',data)
							setTimeout(()=>{
								uni.navigateBack()
							},1000)
						})
					})
				}
			})
		}
    }
}
</script>

<style lang="scss" scoped>
	.idcard-front{
		height:290rpx;
		position: relative;
	}
	.idcard-front::after{
		content: ' ';
		position: absolute;
		height:290rpx;
		width: 100%;
		background:url(/static/user/idcard_front.png);
		background-repeat: no-repeat;
		background-size: 100%;
		background-position:center center;
		opacity: 0.2;
		top: 0;
		left: 0;
	}
	.idcard-back{
		height:290rpx;
		position: relative;
	}
	.idcard-back::after{
		height:290rpx;
		width: 100%;
		background:url(/static/user/idcard_back.png);
		background-repeat: no-repeat;
		background-size: 100%;
		background-position:center center;
		opacity: 0.2;
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
	}
	
</style>