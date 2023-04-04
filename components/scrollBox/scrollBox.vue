<template>
	<view>
		<view class="fixedbox" :animation="animationData" @touchstart.stop="touchIcon" @touchmove.stop.prevent="moveIcon" @tap.stop="tapIcon" :style="{left:iconPosition.left+'px',top:iconPosition.top+'px'}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	let animation = uni.createAnimation({
		timingFunction: 'ease',
	})
	export default {
		data() {
			return {
				animationData: {},
				windowSize:{
					width:0,
					height:0,
					margin:{
						left:10,
						right:10,
						top:10,
						bottom:10,
					}
				},
				iconSize:{
					width:80,
					height:80
				},
				iconPosition:{
					left:0,
					top:0,
					touchPostion:{
						x:0,
						y:0
					}
				},
			}
		},
		props:{
			// 页面滚动距离
			isShow: {
				type: Number,
				default: 0
			},
			startPostion:{
				type:Number,
				default:2
			},
			iconWidth:{
				type:Number,
				default:80
			},
			iconHeight:{
				type:Number,
				default:80
			},
			marginLeft:{
				type:Number,
				default:10
			},
			marginRight:{
				type:Number,
				default:10
			},
			marginTop:{
				type:Number,
				default:10
			},
			marginBottom:{
				type:Number,
				default:60
			},
			/*tapFunction:{
				type:Function,
				default:this.tapIcon
			}*/
		},
		mounted() {
			this.$set(this.iconSize,'width',this.iconWidth);
			this.$set(this.iconSize,'height',this.iconHeight);
			this.$set(this.windowSize.margin,'left',this.marginLeft);
			this.$set(this.windowSize.margin,'right',this.marginRight);
			this.$set(this.windowSize.margin,'top',this.marginTop);
			this.$set(this.windowSize.margin,'bottom',this.marginBottom);
			this.$set(this.windowSize,'width',uni.getSystemInfoSync().windowWidth);
			this.$set(this.windowSize,'height',uni.getSystemInfoSync().windowHeight);
			switch(this.startPostion){
				case 0:
				//初始位置左上角
				this.$set(this.iconPosition,'left',this.windowSize.margin.left);
				this.$set(this.iconPosition,'top',this.windowSize.margin.top);
				break;
				case 1:
				//初始位置右上角
				this.$set(this.iconPosition,'left',this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
				this.$set(this.iconPosition,'top',this.windowSize.margin.top);
				break;
				case 2:
				//初始位置左下角
				this.$set(this.iconPosition,'left',this.windowSize.margin.left);
				this.$set(this.iconPosition,'top',this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom);
				break;
				default:
				//初始位置右下角
				this.$set(this.iconPosition,'left',this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
				this.$set(this.iconPosition,'top',this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom);
				break;
			}
		},
		created() {
			//默认不显示
			animation.opacity(0).step({duration:0});
			this.animationData = animation.export()
		},
		watch: {
			isShow(newVal, oldVal) {
				if (newVal > 0) {
					//淡入
					animation.opacity(1).step({duration:800}) //描述动画
					this.animationData = animation.export()
				} else {
					//淡出
					animation.opacity(0).step({duration:800})
					this.animationData = animation.export()
				}
			}
		},
		methods: {
			touchIcon(e){
				//console.log(e);
				this.$set(this.iconPosition.touchPostion,'x',e.touches[0].clientX);
				this.$set(this.iconPosition.touchPostion,'y',e.touches[0].clientY);
			},
			moveIcon(e){
				//console.log(e)
				/*this.iconPosition.left += (e.touches[0].clientX - this.iconPosition.touchPostion.x);
				this.iconPosition.top += (e.touches[0].clientY - this.iconPosition.touchPostion.y);
				this.iconPosition.touchPostion.x = e.touches[0].clientX;
				this.iconPosition.touchPostion.y = e.touches[0].clientY;*/
				this.$set(this.iconPosition,'left', e.touches[0].clientX - uni.upx2px(this.iconSize.width / 2));
				this.$set(this.iconPosition,'top', e.touches[0].clientY - uni.upx2px(this.iconSize.height / 2) + uni.getSystemInfoSync().windowTop);
				//console.log(uni.getSystemInfoSync());				
				this.$set(this.iconPosition,'left',Math.min(this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right, this.iconPosition.left));
				this.$set(this.iconPosition,'left',Math.max(this.windowSize.margin.left, this.iconPosition.left));
				this.$set(this.iconPosition,'top',Math.min(this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom, this.iconPosition.top));
				this.$set(this.iconPosition,'top',Math.max(this.windowSize.margin.top, this.iconPosition.top));
			},
			tapIcon(e){
				//console.log('you tap icon');
				//this.$emit('tapIcon');
			},
		}
	}
</script>
<style scoped lang="scss">
	.fixedbox{
		position: fixed;
		z-index:300;
		border: none;
	}
</style>
