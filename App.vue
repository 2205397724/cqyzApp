<script>
	import AppUpdate from "@/uni_modules/js_sdk/AppUpdate/AppUpdate/index.js"
	const System = uni.getSystemInfoSync();
	export default {
		onLaunch: function() {
			let that = this;
			// 横屏禁止
			// #ifdef APP-PLUS  
			plus.screen.lockOrientation("portrait-primary"); 
			// #endif
			//中间按钮触发
			uni.onTabBarMidButtonTap(() => {
				uni.navigateTo({
					url: "/pages/page/publish/publish",
					animationType: 'slide-in-bottom',
				})
			})
			// #ifdef APP-PLUS 
			// 监听推送消息事件
			plus.push.addEventListener('receive', function(msg) {
				plus.push.setAutoNotification(true)
				let payload = typeof msg.payload == 'string' ? JSON.parse(msg.payload) : msg.payload;
				if (System.platform === 'ios') { // iOS平台
					if (msg.aps !== null) { // apns 通道
						if (!payload.localmsg) {
							payload.localmsg = true;
							plus.push.createMessage(payload.title, JSON.stringify(payload));
							plus.runtime.setBadgeNumber(1);
						}
					} else { // 个推通道
						if (msg.payload !== null) {
							if (!payload.localmsg) {
								payload.localmsg = true;
								plus.push.createMessage(payload.title, JSON.stringify(payload));
							}
						}
					}
				} else if (System.platform === 'android') { // 安卓平台
					plus.push.createMessage(payload.title, JSON.stringify(payload));
					plus.runtime.setBadgeNumber(1);
				}
			});
			// 监听点击消息事件
			plus.push.addEventListener('click', function(msg) {
				let payload = typeof msg.payload == 'string' ? JSON.parse(msg.payload) : msg.payload;
				if(payload.hasOwnProperty('tgt') && payload.tgt){
					let pagesArr =['elect','vote','survey','jointly']
					if (pagesArr.indexOf(payload.tgt_type)>0){
						payload.tgt_type = 'survey'
					}
					payload.page = payload.tgt_type +'/detail/detail?id='+payload.tgt
				}
				if(payload.hasOwnProperty('page') && payload.page){
					that.pushGo(payload);
				}
			});
			//检查APP版本更新
			AppUpdate(true)
			// #endif
			
			// 监听网络状态
			uni.onNetworkStatusChange(function(res) {
			    if (!res.isConnected) {
			        uni.showLoading({
			            title: '当前无网络！'
			        })
			    } else {
			        uni.hideLoading()
			        uni.showToast({
			            icon: 'none',
			            title: `当前网络类型：${res.networkType}`
			        })
			    }
			})
		},
		onShow: function() {
			// #ifdef APP-PLUS
			// 获取APP启动方式，根据参数进行跳转。
			let that = this;
			setTimeout(function() {
				let launcherType = plus.runtime.launcher;
				let parguments = plus.runtime.arguments;
				//清除值，要不然每次都会跳转。
				plus.runtime.launcher = '';
				plus.runtime.arguments = '';
				//scheme跳转。
				if (launcherType == 'scheme' && parguments) {
					let arg = parguments;
					let pos = parguments.indexOf("//");
					let argArr = (arg.slice(pos + 2)).split('?');
					that.pageGo(argArr[0], argArr[1]);
				};
				//IOS浏览器通过Universal links启动
				if (launcherType == 'uniLink' && parguments) {
					let arg = parguments.split('?');
					let argArr = arg[1].split('&');
					let i = 0;
					let parArr = [];
					while (argArr[i]) {
						let temp = argArr[i].split('=');
						parArr.push(temp[1]);
						i++;
					}
					that.pageGo(parArr[0], parArr[1]);
				};
				//相传是安卓微信浏览器
				if (launcherType == 'miniProgram' && parguments) {
					let arg = JSON.parse(parguments);
					that.pageGo(arg.path, arg.id);
				}
			}, 0);
			// #endif
		},
		onHide: function() {
			
		},
		methods:{
			//页面跳转
			pageGo(path, id) {
				uni.navigateTo({
					url: '/pages/' + path + '/detail/detail?id=' + id
				});
			},
			// 推送消息转跳页面
			pushGo(payload) {
				if (payload.page.indexOf("tabbar") == -1) {
					uni.navigateTo({
						url: '/pages/' + payload.page 
					})
				} else {
					uni.switchTab({
						url: '/pages/' + payload.page 
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/static/base.scss';
	@import url('https://smart.cqyezhuapp.com/appcss/default.css');
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color:$uni-bg-color;
		height: 100%;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
