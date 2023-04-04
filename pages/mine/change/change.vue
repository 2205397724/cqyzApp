<template>
	<view>
		<headbar :title="'修改资料'"></headbar>
		<view>
			<uni-forms ref="form" :modelValue="formData" style="margin: 0 30rpx;padding-top: 30rpx;" label-position="top" label-align="left" label-width="50" >
				<uni-forms-item label="头像">
					<view class="" @click="clickFuncChooseImg">
						<image class="badge-lgx badge-circle" :src="user_info.avatarUrl" mode="aspectFill"></image>
					</view>
				</uni-forms-item>
				<uni-forms-item label="昵称"  >
					<uni-easyinput v-model="formData.nickname" :inputBorder="false" type="text" class="na-input" trim="all"/>
				</uni-forms-item>
				<uni-forms-item label="性别"  >
					<view class="bg-white border-radius-base p-20">
						<uni-data-checkbox v-model="formData.gender" selectedColor="#00b7bd" :localdata="sexs" />
					</view>
				</uni-forms-item>
				<!-- <uni-forms-item label="生日"  >
					<view class="bg-white border-radius-base p-30">
						<picker @change="val=>{formData.user.created_at = val.detail.value }" mode='date'	>
							<view>{{ formData.user.created_at || '请选择'}}</view>
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="手机号"  >
					<uni-easyinput class="na-input" :inputBorder="false" v-model="formData.user.mobile" type="text"/>
				</uni-forms-item> -->
				<!-- <uni-forms-item label="密码"  :errorMessage="err_obj['password']?err_obj['password'][0]:''">
					<uni-easyinput class="na-input" :inputBorder="false" v-model="formData.password" type="password" trim="all" :errorMessage="!!err_obj['password']"/>
				</uni-forms-item> -->
				<view class="p-tb-30">
					<button type="primary" @click="submit">保 存</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	// 配置项
    import {VITE_APP_FOLDER_SRC,URL_LOGO} from '@/pages/framework/config/app.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { USER_INFO,UID } from '@/pages/framework/config/cache.js'
	import GetFilesKey from '@/pages/framework/utils/file/file.js'
	import {AVATAR} from '@/pages/framework/config/folder.js'
	import {
		putUserInfo,
		getUserInfo,
		putCustomInfo
	} from './service/api.js'

	export default {
		data() {
			return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				opts_all:{},
				formData: {},
				err_obj:{},
				user_info: '',
				sexs:[{
					text: '男',
					value: 'M'
				}, {
					text: '女',
					value: 'F'
				}, {
					text: '保密',
					value: 'U'
				}],
			}
		},
		onLoad() {
			// getOpts(['gender']).then(res => {
			// 	this.opts_all = res
			// })
			this.user_info = this.utils.getUser()
			this.formData={
				gender:this.user_info.gender,
				nickname:this.user_info.nickname
			}
		},
		methods: {
			clickFuncChooseImg(){
				uni.chooseImage({
					count:1,
					success:res=>{
						this.formData.avatar = res.tempFilePaths[0]
						this.user_info.avatarUrl = res.tempFilePaths[0]
					}
				})
			},
			submit() {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确定提交么？',
					success:  res => {
						if (res.confirm) {
							this.err_obj = {}
							let data = {
								nickname:this.formData.nickname,
							}
							const avatar = new Promise((resolve, reject) => {
								if(this.formData.avatar){
									GetFilesKey(AVATAR,[this.formData.avatar]).then(res=>{
										resolve(res[0])
									}).catch(err=>{
										reject(err)
									})
								}else{
									resolve(0)
								}
							})
							Promise.all([avatar]).then(res=>{
								if(res[0]){
									data.avatar = res[0]
								}
								putCustomInfo(data).then(res=>{
									let data1 = {
										mobile:_this.user_info.mobile,
										gender:_this.formData.gender,
									}
									putUserInfo(_this.user_info.id,data1).then(res=>{
										getUserInfo().then(user_info=>{
											let data = user_info.data
											data.avatarUrl = data.avatar ? VITE_APP_FOLDER_SRC+data.avatar :URL_LOGO
											_this.utils.setUser('info',data)
											uni.showToast({
												icon: 'none',
												title: "修改成功",
												duration: 1000,
												mask:true
											})
											setTimeout(() => {
												uni.navigateBack()
											}, 1000)
										})
									})
								}).catch(err=>{
									this.err_obj = err.data
								})
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
