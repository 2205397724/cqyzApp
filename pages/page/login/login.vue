<template>
	<view class="main-pad">
		<view class="logo-box">
			<surplus-hair></surplus-hair>
			<image class="logo" src="@/static/logo.png" mode="widthFix"></image>
		</view>
		<view class="flex-row bg-linear-green2white p-20 border-radius-base" v-if="auth_info.openid">
			<view class="flex-row flex-center">
				<image class="badge-base badge-circle" v-if="auth_info.avatar" :src="auth_info.avatar" mode="widthFix"></image>
				<span class="p-lr-20 font-primary">{{auth_info.nickname || '登录成功,请绑定手机号'}}</span>
			</view>
		</view>
		<view class="p-tb-30">
			<v-tabs v-model="login_type" :tabs="login_type_arr" field="val" @change="typeChange"></v-tabs>
		</view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" label-align="center" :border="true">
			<uni-forms-item name="user" :errorMessage="errMsg&&errMsg['mobile']?errMsg['mobile'][0]:''">
				<uni-easyinput class="na-input" type="number" v-model="formData.user" placeholder="请输入手机号"
					:inputBorder="false" maxlength="11" />
			</uni-forms-item>
			<uni-forms-item name="password" style="border-style: none;" v-if="code_or_password"
				:errorMessage="errMsg&&errMsg['password']?errMsg['password'][0]:''">
				<uni-easyinput class="na-input" type="password" v-model="formData.password" placeholder="请输入密码"
					:passwordIcon="true"
					:inputBorder="false" />
			</uni-forms-item>
			<uni-forms-item name="password" style="border-style: none;" v-else
				:errorMessage="errMsg&&errMsg['sms_code']?errMsg['sms_code'][0]:''">
				<view class="code-box">
					<uni-easyinput class="na-input" type="number" v-model="formData.code" placeholder="请输入验证码" :inputBorder="false" maxlength="6" @input="(res)=>{getRuleVal('password',res)}" />
					<view class="item-code" @click="getCodeFunc" :style="{'color':code_num>0?'#aaaaaa':''}">
						<text v-if="code_num>0">{{code_num}}秒</text>
						<text class="font-primary" v-else>发送验证码</text>
					</view>
				</view>
			</uni-forms-item>
			<uni-forms-item label="" name="agree" style="border-style: none;">
				<checkbox-group @change="(res)=>{formData.agree = res.detail.value}">
					<label class="checkbox-class">
						<checkbox focus value="true" :checked="formData.agree.length>0?true:false"
							style="transform:scale(0.7)" />
						<view class="font-grey">
							<text>我已经阅读并同意</text>
							<text class="agree-color" @click.stop="goAgree">《用户协议》</text>
							<text>与</text>
							<text class="agree-color" @click.stop="goTerm">《隐私政策》</text>
						</view>
					</label>
				</checkbox-group>
			</uni-forms-item>
		</uni-forms>
		<button type="primary" class="btn" :disabled="formData.user&&formData.password?false:true" @click="submit">登
			录</button>
		<view class="flex-row flex-center font-grey size-base p-t-40">
			<text @click="proLoginFunc">本机号码一键登录</text>
		</view>
		<view class="wx-app-login">
			<view class="login-item" @click="otherLoginFunc('weixin','wx')">
				<image class="img" style="background-color: #1ABB1D;" src="@/static/icon/weixin.png"></image>
			</view>
			<view class="login-item" v-if="is_ios_13" @click="otherLoginFunc('apple','apple')">
				<image class="img" style="background-color: #000000;" src="@/static/icon/apple-fill.png"></image>
			</view>
		</view>
		<!-- 人机验证 -->
		<vaptcha-v3
			v-if="isShowVaptcha"
			:vid="vid"
			:url="url"
			@receive="handleMessage" />
		<uni-popup ref="showtip" type="center">
			<view class="uni-tip" >
				<text class="uni-tip-title">用户协议与隐私政策</text>
				<text class="uni-tip-content">
					请你务必审慎阅读,充分理解服务协议和隐私政策各条款,包括但不限于为了向你提供即时通讯,内容分享等服务,我们需要收集你的设备信息、操作日志等个人信息,你可以在“设置中查看、变更、删除个人信息并管理你的授权。你可阅读
					<text class="login-term_highlight" @click="goAgree()">
						《用户协议》
					</text>与<text class="login-term_highlight"
						@click="goTerm()">
						《隐私政策》
					</text>了解详细信息。若你同意，请点击“同意”接受我们的服务。
				</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="closeTips">不同意</text>
					<text class="uni-tip-button font-primary"
						@click="()=>{closeTips();formData.agree = ['true']}">同意</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	
	import {
		postLoginSMS,
		postCode,
		postLoginLocal,
		postLoginOne,
		postLoginOther,
		getUserInfo,
		putClientid
	} from './service/api.js'
	import {
		VAPTCHA_API,
		VAPTCHA_VID,
		EQTYPESTR
	} from '@/pages/framework/config/app.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import {
		TOKEN,
		EXPIRES_TIME,
		LOGIN_TEL,
		USER_INFO,
		UID,
		REGION,
		ZONE,
		ROLE
	} from '@/pages/framework/config/cache.js'
	export default {
		data() {
			return {
				// 短信验证
				vid: VAPTCHA_VID, // 验证单元vid,登录vaptcha用户后台创建
				url: VAPTCHA_API, // 自己的服务器地址
				isShowVaptcha: false, // 控制手势验证组件的显示与隐藏
				isVaptcha:false,// 手势验证开关
				// 验证码还是密码
				code_or_password: false,
				// 倒计时对象
				interval: null,
				// 倒计时
				code_num: 0,
				login_type:0,
				login_type_arr:[{
					key: 0,
					val: '手机登录'
				},{
					key: 1,
					val: '密码登录'
				}],
				// 表单数据
				formData: {
					user: '',
					password: '',
					agree: []
				},
				errMsg: {},
				// 对name字段进行必填验证
				rules: {
					user: {
						validateTrigger: 'bind',
						rules: [{
								required: true,
								errorMessage: '请输入手机号',
							},
							{
								minLength: 11,
								maxLength: 11,
								errorMessage: '请输入正确的手机号！',
							}
						]
					},
					password: {
						validateTrigger: 'bind',
						rules: [{
							required: true,
							errorMessage: '请输入密码或验证码',
						}]
					},
					agree: {
						rules: [{
							required: true,
							errorMessage: '请阅读并同意隐私政策',
						}]
					},
				},
				is_ios_13: false,
				auth_info:{
					openid:'',
					nickname:'',
					avatar:''
				} //三方登录成功后的信息
			}
		},
		onLoad() {
			this.formData.user = Cache.get(LOGIN_TEL)
		},
		onReady() {
			// #ifdef APP-PLUS
			plus.navigator.setStatusBarStyle('dark')
			// #endif
			this.isIos13()
		},
		methods: {
			// 三方登录
			otherLoginFunc(str,state) {
				let _this = this
				uni.login({
				    provider: str,
				    success: function (loginRes) {
				        uni.getUserInfo({
				            provider: str,
				            success: function(info) {
								let data = {
									"auth_type": EQTYPESTR,
									"oauth_type": state,
									"oauth_id" :''
								}
								_this.auth_info.oauth_type = state
								if(str=='weixin'){
									_this.auth_info.openid = info.userInfo.unionId
									_this.auth_info.nickname = info.userInfo.nickName
									_this.auth_info.avatar = info.userInfo.avatarUrl
									data.oauth_id = info.userInfo.unionId
								}else if(str=='apple'){
									_this.auth_info.openid = info.userInfo.openId
									_this.auth_info.nickname = info.userInfo.familyName+ info.userInfo.middleName + info.userInfo.nickName
									data.oauth_id = info.userInfo.openId
									
								}
								postLoginOther(data).then(res=>{
									_this.goIndexFunc(res)
								}).catch(err=>{
									uni.showToast({
									    icon: 'none',
									    title: '请绑定手机号',
									    duration: 3000,
									    mask: true
									})
								})
				            }
				        })
				    },
				    fail: function (err) {
						uni.showToast({
						    icon: 'none',
						    title: str+'登录失败！',
						    duration: 3000,
						    mask: true
						})
				    }
				});
			},
			typeChange(e){
				this.code_or_password=e;
				this.initialize();
			},
			// 判断是否为ios 13+
			isIos13() {
			    if (uni.getSystemInfoSync().platform == 'ios') {
			        try {
			            const res = uni.getSystemInfoSync()
			            var num = res.system.replace(/[^0-9]/ig, '')
			            if (num >= 13) {
			                this.is_ios_13 = true
			            } else {
			                this.is_ios_13 = false
			            }
			        } catch (e) {
			            this.is_ios_13 = false
			        }
					this.openTips()
			    }
			},
			// 一键登录
			proLoginFunc() {
				let _this = this;
				uni.preLogin({
					provider: 'univerify',
					success() { //预登录成功
						let buttonlist = [{
							'provider': 'weixin',
							'iconPath': '/static/icon/logoweixin.png' // 图标路径仅支持本地图片
						}]
						if(_this.is_ios_13){
							buttonlist.push({
								'provider': 'apple',
								'iconPath': '/static/icon/logoios.png' // 图标路径仅支持本地图片
							})
						}
						uni.login({
							provider: 'univerify',
							univerifyStyle: {
								'fullScreen': true,
								'icon': {
								    'path': '/static/logo.png' // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
								},
								'authButton': {
								    'normalColor': '#12C4D0', // 授权按钮正常状态背景颜色 默认值：#3479f5  
								    'highlightColor': '#eeeeee', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
								    'title': '本机号码一键登录' // 授权按钮文案 默认值：“本机号码一键登录”  
								},
								'otherLoginButton': {  
								    'title': '手机验证码登录' // 其他登录方式按钮文字 默认值：“其他登录方式”  
								},  
								'privacyTerms': {
									"defaultCheckBoxState":false,
								    'privacyItems': [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效  
								        {
								            'url': 'https://app.cqyezhuapp.com/agreement.html', // 点击跳转的协议详情页面  
								            'title': '用户协议' // 协议名称  
								        },
								        {
								            'url': 'https://app.cqyezhuapp.com/privacy.html', // 点击跳转的协议详情页面  
								            'title': '隐私政策' // 协议名称  
								        }
								    ]
								},
								'buttons': {
								    'iconWidth': '45px', // 图标宽度（高度等比例缩放） 默认值：45px
								    'list': buttonlist
								}
							},
							success: function(res) {
								postLoginOne({ "auth_type": EQTYPESTR, "access_token": res.authResult.access_token, "openid": res.authResult.openid }).then(val=>{
									uni.closeAuthView()
									_this.goIndexFunc(val)
								}).catch(err => {
									setTimeout(()=>{
										uni.closeAuthView()
									},1000)
								})
							},
							fail: function(err) {
								console.log(err)
								uni.closeAuthView()
							    if (err.index == 0) {
							        // _this.wxLoginFunc()
							    } else if (err.index == 1) {
							        // _this.iosLoginFunc()
							    }
							}
						})
					},
					fail(err) { // 预登录失败
						console.log(err)
						uni.showToast({
							icon: 'none',
							title: err.errMsg,
						})
					}
				})
			},
			//同意，关闭弹窗
			closeTips() {
				this.$refs.showtip.close()
			},
			openTips() {
				this.$refs.showtip.open()
			},
			// 单个校验
			getRuleVal(key, val) {
				this.formData.password = val
				this.$refs.form.setValue(key, this.formData.password)
			},
			// 初始化输入框
			initialize() {
				this.formData.password = ''
				this.formData.agree = []
			},
			// 成功
			goIndexFunc(res){
				Cache.set(TOKEN, res.data.access_token, res.data.expires_in)
				Cache.set(EXPIRES_TIME, res.data.expires_in, res.data.expires_in)
				Cache.set(LOGIN_TEL, this.formData.user)
				getUserInfo().then(user_info=>{
					let data = user_info.data
					//Cache.set(USER_INFO,{[data.id]:{'info':data,'role':'user'}})//用户默认为个人用户
					Cache.set(data.id+'_info',data)
					Cache.set(data.id+'_role','user')
					Cache.set(UID,data.id)
					// #ifdef APP-PLUS
					let clientid = plus.push.getClientInfo().clientid
					putClientid({"cid":clientid}).then(res=>{})
					// #endif
					uni.showToast({
						icon: 'none',
						// title: user_info.msg,
						title:"登录成功",
						// title:user_info.errMsg,
						duration: 1000
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/tabbar/index/view/index'
						});
					}, 1000)
				})
			},
			// 表单提交
			submit() {
				let _this = this
				this.$refs.form.validate().then(res => {
					if (this.code_or_password) {
						let data = {
							"auth_type": EQTYPESTR,
							"username": _this.formData.user,
							"password": _this.formData.password
						}
						if(_this.auth_info.openid){
							data.oauth_type = _this.auth_info.oauth_type
							data.oauth_id = _this.auth_info.openid
							data.nickname =  _this.auth_info.nickname
						}
						postLoginLocal(data).then(res => {
							_this.goIndexFunc(res)
						}).catch(err => {
							_this.errMsg = err.data
						})
					} else {
						let data = {
							"auth_type": EQTYPESTR,
							"mobile": _this.formData.user,
							"sms_code": _this.formData.password,
						}
						if(_this.auth_info.openid){
							data.oauth_type = _this.auth_info.oauth_type
							data.oauth_id = _this.auth_info.openid
							data.nickname =  _this.auth_info.nickname
						}
						postLoginSMS(data).then(res => {
							//res:token的值
							_this.goIndexFunc(res)
						}).catch(err => {
							console.log(err)
							_this.errMsg = err.data
						})
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
					if (this.formData.agree.length <= 0) {
						this.openTips()
					}
				})
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
					scene: 'login',
					mobile: this.formData.user,
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
			// 发送验证码
			getCodeFunc() {
				this.getRuleVal('user', this.formData.user)
				if (this.formData.user.length == 11) {
					if(this.isVaptcha){
						this.isShowVaptcha = true //显示手势验证窗口
					}else{
						this.code_num<=0 && this.postCodeFunc('11','22')//直接发送验证码无需手势验证
					}
				}
			},
			// 隐私政策
			goTerm() {
				this.utils.jumpWebpage('https://app.cqyezhuapp.com/privacy.html')
			},
			// 用户协议
			goAgree() {
				this.utils.jumpWebpage('https://app.cqyezhuapp.com/agreement.html')
			}

		}
	}
</script>

<style lang="scss" scoped>
	page {
		
	}

	.main-pad {
		box-sizing: border-box;
		padding: 80rpx 5%;
	}

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

	.tips {
		display: flex;
		justify-content: flex-end;
		text-align: center;
	}

	.logo-box {
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding: 40rpx 0;

		.logo {
			width: 140rpx;
		}
	}

	.checkbox-class {
		display: flex;
		align-items: center;
		font-size: 24rpx;

		.agree-color {
			color: $uni-theme-primary;
		}
	}

	.tel-login {
		text-align: center;
		box-sizing: border-box;
		padding: 40rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wx-app-login {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding-top: 40rpx;
		box-sizing: border-box;

		.login-item {
			margin-right: 40rpx;

			.img {
				border-radius: 50%;
				box-sizing: border-box;
				width: 98rpx;
				height: 98rpx;
				padding: 20rpx;
			}
		}

		.login-item:last-child {
			margin-right: 0;
		}
	}

	.uni-tip {
		width: 80vw;
		text-align: justify;
		// margin-left: 10%;
		box-sizing: border-box;
		// padding: 40rpx;
		background-color: #fff;
		border-radius: 12rpx;

		.uni-tip-title {
			display: block;
			margin-bottom: 10px;
			text-align: center;
			font-weight: bold;
			font-size: 16px;
			color: #333;
		}

		.uni-tip-content {
			font-size: 28upx;
			color: #666;
			line-height: 150%;
		}

		.login-term_highlight {
			font-size: 28upx;
			line-height: 32upx;
			font-weight: normal;
			color: #12C4D0;
		}

		.uni-tip-group-button {
			display: flex;
			flex-direction: row;
			margin-top: 20px;

			.uni-tip-button {
				flex: 1;
				text-align: center;
				font-size: 32upx;
				color: #3b4144;
			}
		}
	}
</style>
