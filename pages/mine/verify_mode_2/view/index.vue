<!-- 实名认证方式2 -->
<template>
	<view class="">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<headbar  backgroundColor="transparent"></headbar>
			<view class="na-main">
				<view class="size-lx strong">身份证识别</view>
				<view class="size-sm font-grey p-t-10">仅用于实名认证，照片不会保存，请放心操作。身份证识别由百度智能云提供。</view>
			</view>
			<view class="na-main p-tb-30" @click="clickFuncChoose(true)">
				<view  class="na-card bg-white p-40">
					<view v-if="!front_img" class="idcard-front flex-column flex-center">
						<view class="upload_icon_green"></view>
						<view class="p-10 font-primary size-base">上传身份证正面</view>
					</view>
					<image v-else class="imgon idcard-front flex-column flex-center" style="display: block;width:100%;border-radius: 6px;" :src="front_img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="na-main p-b-40" @click="clickFuncChoose(false)">
				<view class="na-card bg-white p-40">
					<view v-if="!back_img" class="idcard-back flex-column flex-center">
						<view class="upload_icon_green"></view>
						<view class="p-10 font-primary size-base">上传身份证背面</view>
					</view>
					<image v-else class="imgon idcard-back flex-column flex-center" style="display: block;width:100%;border-radius: 6px;" :src="back_img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="na-main">
				<button type="primary" @click="clickFuncUpload">提交</button>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		USER_INFO,
		UID
	} from '@/pages/framework/config/cache.js'
import GetFilesKey from '@/pages/framework/utils/file/file.js'
import {putIdCart,getReady,getUserInfo} from '../service/api.js'
import {ID_CART} from '@/pages/framework/config/folder.js'
import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import {VITE_APP_FOLDER_SRC,URL_LOGO} from '@/pages/framework/config/app.js'
export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
			opts_all:{},
            // 下拉刷新的配置(可选, 绝大部分情况无需配置)
            downOption: {
                native: true
            },
            // 上拉加载的配置(可选, 绝大部分情况无需配置)
            upOption: {
                noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
            },
			front_img: '',
			back_img: '',
			upload: false
        }
    },
    onLoad() {
		getOpts(['status_cert']).then(res => {
			// 将四种状态传递给this.opts.all
		    this.opts_all = res
		})
	},
    methods: {
		// 身份证认证状态
		getFuncReady(){
			let _this = this
			getReady().then(res=>{
				if(res.data.status_cert == this.opts_all.status_cert[2].key){
					getUserInfo().then(user_info=>{
						let data = user_info.data
						data.avatarUrl = data.avatar ? VITE_APP_FOLDER_SRC + data.avatar : URL_LOGO
						_this.utils.setUser('info',data)
						_this.utils.setUser('role','user')
						uni.showToast({
							icon:'success',
							title:  `当前状态：${this.getFuncOptVal(this.opts_all.status_cert,res.data.status_cert)}`,
							duration: 2000
						})
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					})
				}else {
					uni.showToast({
						icon:'error',
						title:  `认证失败，请重新提交`,
						duration: 2000
					})
				}
			})
		},
		// 上传身份证
		clickFuncUpload(){
			if(this.upload){
				this.getFuncReady()
				return false
			}
			if(!this.front_img||!this.back_img){
				uni.showToast({
					icon:'none',
					title:'请选择身份证正、反面照片！'
				})
				return false
			}
			GetFilesKey(ID_CART,[this.front_img,this.back_img]).then(res=>{
				// console.log({side_front:res[0],side_back:res[1]})
				putIdCart({side_front:res[0],side_back:res[1]}).then(res=>{
					this.upload = true
					uni.showToast({
						icon:'loading',
						title:  `正在处理中请稍后`,
						duration: 2000
					})
					setTimeout(()=>{
						this.getFuncReady()
					},2000)
				})
			})
		},
		// 选择身份证
		clickFuncChoose(front){
			uni.chooseImage({
				count: 1, 
				sizeType: ['original'], 
				crop:{
					width:441,
					height:358
				},
				success:  res=> {
					this.upload = false
					if(front){
						this.front_img = res.tempFilePaths[0]
						return false
					}
					this.back_img = res.tempFilePaths[0]
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
		getFuncOptVal(arr,key){
			return getOptVal(arr,key)
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