<template>
	<view>
		<headbar :title="'修改密码'"></headbar>
		<view class="na-main p-tb-30">
			<uni-forms ref="form" :modelValue="formData" label-position="top" label-align="left" label-width="120">
				<uni-forms-item label="用户名">
					<view class="bg-white border-radius-base p-30">
						{{formData.username}}
					</view>
				</uni-forms-item>
				<uni-forms-item label="新密码">
					<uni-easyinput v-model="formData.password"  class="na-input" :inputBorder="false"  type="text"/>
				</uni-forms-item>
				<view class="p-tb-30">
					<button type="primary" @click="submit">保 存</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	// // 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { USER_INFO } from '@/pages/framework/config/cache.js'
	import {
		putPassword,
	} from './service/api.js'

	export default {
		data() {
			return {
				opts_all:{},
				formData: {},
				err_obj:{},
				user_id:'',
				tel:'',
				user_info:{}
			}
		},
		onLoad() {
			getOpts(['gender']).then(res => {
				this.opts_all = res
			})
			this.user_info = this.utils.getUser()
			this.formData = this.user_info
			this.user_id = this.user_info.id
			this.tel = this.user_info.mobile
		},
		methods: {
			// clickFuncChooseImg(){
			// 	uni.chooseImage({
			// 		count:1,
			// 		success:res=>{
			// 			this.formData.avatar = res.tempFilePaths[0]
			// 		}
			// 	})
			// },
			submit() {
				uni.showModal({
					title: '提示',
					content: '确定提交么？',
					success:  res => {
						if (res.confirm) {
							let data = {
								mobile:this.tel,
								username:this.formData.username,
								password: this.formData.password
							}
							putPassword(this.user_id,data).then(res=>{
								this.err_obj = {}
								uni.showToast({
									icon: 'none',
									title: '修改成功',
									duration: 1000,
									mask:true
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)
							}).catch(err=>{
								this.err_obj = err.data
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			}
		}
	}
</script>

<style lang="scss" >

</style>
