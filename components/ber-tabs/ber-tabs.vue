<template>
	<scroll-view scroll-x="true" style="white-space: nowrap;">
		<text class="item" :class="{'on':active_tab.value==item.value}" v-for="(item,i) in tab_list" :key="item.value"
			@click="()=>{active_tab=item;clickFuncChooseTab()}">{{item.text}}</text>
	</scroll-view>
</template>

<script>
		// <ber-tabs :list="tab_arr" v-model="active_tab"></ber-tabs>
		// tab_arr: [{ value: 0, text: '待审' }, { value: 1, text: '已通过' }, { value: 2, text: '未通过' }],
		// active_tab:{ value: 0, text: '待审' }
	export default {
		name: 'berTabs',
		props: {
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			value: {
				type: Object,
				default: () => {
					return {}
				}
			},
			color: {
				type: String,
				default: '#eeeeee'
			}
		},
		watch: {
			list: {
				handler(new_val) {
					this.tab_list = new_val
				},
				immediate: true,
				deep: true
			},
			value: {
				handler(new_val) {
					this.active_tab = new_val
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				tab_list: [],
				active_tab: {}
			}
		},
		methods: {
			clickFuncChooseTab() {
				this.$emit('input', this.active_tab)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.item {
		color: #333333;
		box-sizing: border-box;
		margin-left: 20rpx;
		margin-right: 20rpx;
		font-size: 32rpx;
		position: relative;
		margin-bottom: 16rpx;
		display: inline-block;
	}
	.item:first-child {
		margin-left: 0;
	}

	.item:last-child {
		margin-right: 0;
	}

	.item.on {
		color: #409EFF;
		font-weight: 800;
	}
	.item::after{
		display: block;
		content: '';
		position: absolute;
		bottom: -16rpx;
		left: 50%;
		width: 0;
		height: 8rpx;
		border-radius: 12rpx;
		background-color: #409EFF;
		transition: width 0.3s, left 0.3s;
	}
	.item.on::after{
		left: 20%;
		width: 60%;
		transition: width 0.3s, left 0.3s;
	}
</style>
