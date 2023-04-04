<template>
	<view>
		<headbar :title="'修改手机号'"></headbar>
		<view class="na-main p-tb-30">
			<view class="font-darkgrey">
				原手机号码
			</view>
			<view class="font-dark size-lg strong p-tb-20">
				{{tel}}
			</view>
			<uni-forms ref="form" :modelValue="formData" label-position="top" label-align="left" label-width="120">
				<uni-forms-item label="新手机号"  :errorMessage="err_obj&&err_obj['mobile']?err_obj['mobile'][0]:''" >
					<uni-easyinput v-model="formData.mobile" class="na-input" :inputBorder="false" maxlength="11"  type="text"/>
				</uni-forms-item>
				<uni-forms-item label="验证码"  :errorMessage="err_obj&&err_obj['sms_code']?err_obj['sms_code'][0]:''" >
					<view class="code-box">
						<uni-easyinput class="na-input" type="number" v-model="formData.code" placeholder="请输入验证码" :inputBorder="false" maxlength="6"  />
						<view class="item-code" @click="getCodeFunc" :style="{'color':code_num>0?'#aaaaaa':''}">
							<text v-if="code_num>0">{{code_num}}秒</text>
							<text class="font-primary" v-else>发送验证码</text>
						</view>
					</view>
				</uni-forms-item>
				<view class="p-tb-30">
					<button type="primary" @click="submit">保 存</button>
				</view>
			</uni-forms>
		</view>
		<!-- 人机验证 -->
		<vaptcha-v3
			v-if="isShowVaptcha"
			:vid="vid"
			:url="url"
			@receive="handleMessage" />
	</view>
</template>

<script>
	// // 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { LOGIN_TEL,USER_INFO  } from '@/pages/framework/config/cache.js'
	import {
		putPhone,
		postCode,
		getUserInfo
	} from './service/api.js'
	import {
		VAPTCHA_API,
		VAPTCHA_VID,
		VITE_APP_FOLDER_SRC,
		URL_LOGO
	} from '@/pages/framework/config/app.js'
	export default {
		data() {
			return {
				opts_all:{},
				formData: {},
				err_obj:{},
				tel: '',
				code_num: 0,
				// 短信验证
				vid: VAPTCHA_VID, // 验证单元vid,登录vaptcha用户后台创建
				url: VAPTCHA_API, // 自己的服务器地址
				isShowVaptcha: false, // 控制组件的显示与隐藏
				isVaptcha:false,// 手势验证开关
				interval: '',
				user_id:'',
			}
		},
		onLoad() {
			getOpts(['gender']).then(res => {
				this.opts_all = res
			})
			let user_info = this.utils.getUser()
			this.tel = user_info.mobile
			this.user_id = user_info.id
		},
		methods: {
			// 验证码改变时间
			codeChange() {
				this.code_num = 60
				this.interval = setInterval(() => {
					this.code_num--
					if (this.code_num <= 0) {
						clearInterval(this.interval)
					}
				}, 1000)
			},
			// 发送短信
			postCodeFunc(server, token) {
				uni.showToast({
					mask: true,
					duration: 10000,
					icon: 'loading',
					title: '发送中...'
				})
				let from = {
					scene: 'modify',
					mobile: this.formData.mobile,
					v_server: server,
					v_token: token,
				}
				postCode(from).then(res => {
					// 请求成功后
					uni.showToast({
						icon: 'none',
						title: '发送成功，请注意查收！'
					})
					this.codeChange()
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: '发送失败！'
					})
				})
			},
			// 短信手势校验
			handleMessage(res) {
				let _this = this
				_this.isShowVaptcha = false
				console.log('关闭')
				if (res.signal === 'pass') {
					// 验证通过后获取到token和server进行后续操作
					console.log('验证通过')
					_this.postCodeFunc(res.data.server, res.data.token)
				}
				if (res.signal === 'cancel') {
					console.log('取消验证')
				}
				if (res.signal === 'error') {
					console.log('请求超时')
				}
			},
			getCodeFunc(){
				if (!this.formData.mobile||this.formData.mobile.length!=11) {
					uni.showToast({
						icon:'none',
						title:'请输入正确的手机号！'
					})
					return false
				}else{
					if(this.isVaptcha){
						this.isShowVaptcha = true //显示手势验证窗口
					}else{
						this.code_num<=0 && this.postCodeFunc('11','22')//直接发送验证码无需手势验证
					}
				}
			},
			submit() {
				if(!this.formData.mobile||this.formData.mobile.length!=11){
					uni.showToast({
						icon:'none',
						title:'请输入正确的手机号！'
					})
					return false
				}
				if(!this.formData.mobile||!this.formData.code){
					uni.showToast({
						icon:'none',
						title:'请输入验证码！'
					})
					return false
				}
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确定提交么？',
					success:  res => {
						if (res.confirm) {
							let data = {
								// sms_code: this.formData.code,
								mobile: this.formData.mobile
							}
							putPhone(this.user_id,data).then(res=>{
								_this.err_obj = {}
								getUserInfo().then(user_info=>{
									let data = user_info.data
									data.avatarUrl = data.avatar ? VITE_APP_FOLDER_SRC + data.avatar : URL_LOGO
									_this.utils.setUser('info',data)
									Cache.set(LOGIN_TEL, this.formData.mobile)
									uni.showToast({
										icon: 'none',
										title: '修改成功',
										duration: 1000,
										mask:true
									})
									setTimeout(() => {
										uni.navigateBack()
									}, 1000)
								})
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

<style lang="scss" scoped>
	.code-box {
		display: flex;
		align-items: center;
		height: 100%;
		border-radius: $uni-border-radius-base;
		padding-right: 20rpx;
		box-sizing: border-box;
		background-color: $uni-bg-color-white;
		.input-code {
			width: 100%;
		}

		.item-code {
			white-space: nowrap;
		}
	}
</style>
