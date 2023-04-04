<template>
	<view class="all-box">
		<view class="box" v-if="str">
			<view class="left" @click.stop="tapStrFunc">
				{{hide?hide_str:show_str}}
			</view>
			<view class="right-box" >
				<view v-if="show" class="right" @click.stop="()=>{eye=!eye;hide=!eye}">
					<image :style="{width:size,height:size}" v-if="eye" src="./icon/eye-open.png"></image>
					<image :style="{width:size,height:size}" v-else src="./icon/eye-close.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// <safe-str type="name" str="是是是" :show="true"></safe-str>
	export default {
		name: "safe-str",
		props: {
			// 字符类型// tel电话 name姓名 id身份证
			type: {
				type: String,
				default: 'tel',
			},
			str: {
				type: String,
				default: '',
			},
			// 是否显示眼睛
			show: {
				type: Boolean,
				default: false,
			},
			// 眼睛大小
			size: {
				type: String,
				default: '36rpx',
			},
			// 是否可以拨号
			dial: {
				type: Boolean,
				default: false,
			},
			isHide:{
				type: Boolean,
				default: true,
			}
		},
		watch: {
			str: {
				handler(newName, oldName) {
					this.show_str = newName
					this.hide_str = this.machiningFunc(newName)
				},
				immediate: true, // 刷新加载 立马触发一次handler
				deep: true // 可以深度检测到 obj 对象的属性值的变化
			},
			isHide:{
				handler(newName, oldName) {
					this.hide = newName
				},
				immediate: true,
				deep: true 
			}
		},
		data() {
			return {
				show_str: '',
				hide_str: '',
				eye: false,
				hide:true,
			};
		},
		methods: {
			// 点击字符事件
			tapStrFunc() {
				let _this = this;
				this.$emit('tapStrFunc', this.hide_str)
				if (this.dial && this.type == 'tel') {
					uni.showModal({
						title: '拨打电话',
						content: `是否拨号${_this.hide?_this.hide_str:_this.show_str}`,
						success: function(res) {
							if (res.confirm) {
								uni.makePhoneCall({
									phoneNumber: _this.show_str //仅为示例
								});
							} else if (res.cancel) {

							}
						}
					});
				}
			},
			// 点击眼睛事件
			machiningFunc(str) {
				let first = '';
				let last = '';
				let length = '';
				switch (this.type) {
					case 'name':
						first = str.slice(0, 1)
						length = str.length
						let len = length>2 ? length-1 : 2
						return `${first}${'*'.repeat(len)}`
						break;
					case 'tel':
						first = str.slice(0, 3)
						last = str.slice(7)
						return `${first}${'*'.repeat(4)}${last}`
						break;
					case 'id':
						first = str.slice(0, 6)
						last = str.slice(14)
						return `${first}${'*'.repeat(8)}${last}`
						break;
				}
				return 'error!'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all-box{
		display: inline-block;
		width: 100%;
	}
	.box {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.left {
			width: auto;
			white-space: nowrap;
		}
		.right-box{
			width: auto;
			.right {
				width: auto;
				font-size: 0;
				min-width: 40rpx;
				box-sizing: border-box;
				padding: 0rpx 6rpx 0rpx 16rpx;
				display: flex;
				align-items: center;
			}
		}
	}
</style>
