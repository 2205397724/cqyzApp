<template>
	<view class='content'>
		<!-- 不加id渲染内容相同，需要给加canvas-id加上传入的id以区分 -->
		<canvas :style="'width: '+this.width+'px;height: '+this.width+'px;'" :canvas-id="'staticCanvas'+this.id"></canvas>
		<canvas :style="'width: '+this.width+'px;height: '+this.width+'px;'" :canvas-id="'runCanvas'+this.id" class="runCanvas"></canvas>
	</view>
</template>

<script>
	export default {
		name:'circle-progress',
		props: {
			width: [Number, String], // 圆的大小
			radius: [Number, String], // 进度条厚度
			progress: [Number, String], // 进度条百分比
			barColor: String, // 进度条颜色
			backgroundColor: String, // 背景颜色
			isRound: { // 是否是圆形画笔
				type: Boolean,
				default: false,
			},
			id: { // 组件的id，多组件共存时使用
				type: [String, Number],
				default: 1,
			},
			// duration: { // 整个动画时长
			// 	type: [String, Number],
			// 	default: 1000,
			// },
		},
		data() {
			return {
				// 从上方圆顶开始绘图
				num: -0.5,
				per:0
			}
		},
		mounted() {
			this.per = (this.progress)/100*2
			//开始动画
			this.start()
		},

		methods: {
			cartoon(num) {
				//新建一个画布
				const ctx = uni.createCanvasContext('runCanvas'+this.id)
				ctx.beginPath()
				ctx.lineCap=this.isRound ? "round" : "square"
				// arc(圆心x,y,半径r,起始角弧度，结束角弧度)
				ctx.arc(this.width/2, this.width/2, this.width/2 -this.radius, -1.5, num * Math.PI)
				ctx.setStrokeStyle(this.barColor)
				ctx.setLineWidth(this.radius)
				ctx.stroke()
				ctx.draw()
			},
			static() {
				//新建一个画布
				const ctx1 = uni.createCanvasContext('staticCanvas'+this.id)
				ctx1.beginPath()
				ctx1.arc(this.width/2, this.width/2, this.width/2 -this.radius, 0, 2 * Math.PI)
				ctx1.setStrokeStyle(this.backgroundColor)
				ctx1.setLineWidth(this.radius)
				ctx1.stroke()
				ctx1.draw()
			},
			start(){
				this.static()
				//开始动画
				var timer = setInterval(() => {
					this.num += 0.005
					this.cartoon(this.num)
					if (this.num > (this.per-0.5)) {
						clearInterval(timer)
					}
				}, 10)
			}

		}
	}
</script>

<style lang="less">
	.content {
		position: relative;
		.runCanvas {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
	
</style>
