<!-- 实名认证方式2 -->
<template>
	<view class="">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar  backgroundColor="transparent"></headbar>
			<view class="na-main">
				<view class="size-lx strong">企业认证</view>
				<view class="size-sm font-grey p-t-10">仅用于企业认证，照片不会保存，请放心操作。</view>
			</view>
			<view class="na-main p-tb-30" @click="clickFuncChoose">
				<view  class="na-card bg-white p-40">
					<view v-if="!com_img" class="idcard-front flex-column flex-center">
						<view class="upload_icon_green"></view>
						<view class="p-10 font-primary size-base">上传营业执照</view>
					</view>
					<image v-else class="imgon idcard-front flex-column flex-center" style="display: block;width:100%;border-radius: 6px;" :src="com_img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="na-main">
				<button type="primary" @click="clickFuncUpload">下一步</button>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	
	import GetFilesKey from '@/pages/framework/utils/file/file.js'
	import {
		postComCert,
		getComCert,
	} from './service/api.js'
	import {COM_CERT} from '@/pages/framework/config/folder.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
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
				com_img: '',
			}
		},
		onLoad() {
			
		},
		methods: {
			// 上传
			clickFuncUpload(){
				if(!this.com_img){
					uni.showToast({
						icon:'none',
						title:'请选择营业执照照片！'
					})
					return false
				}
				uni.showModal({
					title: '提示',
					content: '确定企业认证！',
					success:  res=> {
						if (res.confirm) {
							GetFilesKey(COM_CERT,[this.com_img]).then(res=>{
								postComCert({bus_lic:res[0]}).then(res=>{
									uni.showToast({
										icon:'none',
										mask:true,
										title:'提交成功！'
									})
									setTimeout(()=>{
										this.utils.route('/pages/mine/company/company')
									},1000)
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 选择
			clickFuncChoose(){
				uni.chooseImage({
					count: 1, 
					sizeType: ['original'], 
					crop:{
						width:441,
						height:358
					},
					success:  res=> {
						this.com_img = res.tempFilePaths[0]
					}
				});
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				this.mescroll.endSuccess(1)
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
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
	.imgon::after{
		background:none;
	}
	
</style>