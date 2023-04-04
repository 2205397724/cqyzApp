<template>
	<view class="steps-box">
		<view class="steps-item" v-for="(item,i) in steps_state_ber" :key="item[value][0]" :style="{color:steps_active_ber==item[value][0]?steps_color:'#aaaaaa'}"> 
			{{item[text]}} 
			<view class="st-before" :style="{backgroundColor:steps_active_ber>=item[value][0]?steps_color:'#eeeeee'}"></view>
			<view class="st-after" :style="{backgroundColor:steps_active_ber>=item[value][0]?steps_color:'#eeeeee'}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'berTabs',
		props: ['steps_state','steps_active','steps_color','value','text'],
		data() {
			return {
				steps_state_ber:[],
				steps_active_ber:'',
			}
		},
		watch: {
			steps_state: {
				handler(new_val) {
					let arr = []
					let str = ''
					let g_obj ={}
					for(let i in new_val){
						if(new_val[i].group){
							if(arr[arr.length-1][this.text] !== new_val[i].group){
								arr.push({
									[this.value]:[new_val[i][this.value]],
									[this.text]:new_val[i].group
								})
								continue
							}
							arr[arr.length-1].step.push(new_val[i].step)
							continue
						}
						str = ''
						arr.push({
							[this.value]:[new_val[i][this.value]],
							[this.text]:new_val[i][this.text]
						})
					}
					this.steps_state_ber = arr
				},
				immediate: true,
				deep: true
			},
			steps_active: {
				handler(new_val) {
					this.steps_active_ber = new_val
				},
				immediate: true,
				deep: true
			}
		},
		created() {
			
		},
		methods: {
			
		}
	}
</script>
<style lang="scss" scoped>
	.steps-box{
		display: flex;
		
		.steps-item{
			flex: 2;
			text-align: center;
			padding-top: 20rpx;
			margin-top: 20rpx;
			position: relative;
			font-size: 28rpx;
		}
		
		.steps-item:first-child{
			flex: 1;
			text-align: left;
		}
		.steps-item:last-child{
			flex: 1;
			text-align: right;
		}
		.steps-item .st-after{
			content: '';
			display: block;
			background-color: #eeeeee;
			height: 10rpx;
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
		.steps-item .st-before{
			content: '';
			display: block;
			background-color: #eeeeee;
			height: 20rpx;
			width: 20rpx;
			box-sizing: border-box;
			border-radius: 50%;
			position: absolute;
			top: -6rpx;
			left: calc(50% - 10rpx);
		}
		.steps-item:first-child .st-before{
			content: '';
			left: 0;
		}
		.steps-item:last-child .st-before{
			content: '';
			left: initial;
			right: 0;
		}
	}
</style>
