<template>
	<view class="ber-vote-user" v-if="id&&details">
		<view class="na-title">
			<view v-if="opts_all.step_yt_type[3]&&steptype==opts_all.step_yt_type[3].key" class="text">表决内容</view>
			<view v-else-if="opts_all.step_yt_type[2]&&steptype==opts_all.step_yt_type[2].key" class="text">投票内容</view>
			<view class="more" style="color: #00b7bd;display: flex;align-items: center;font-size: 26rpx;"> </view>
		</view>
		<view class="bjnr-bg"   v-if="user_vote">
			<view style="font-size: 24rpx;color: #ffffff;text-align: right;">
				<!-- 查看详细 -->
				<uni-icons type="help-filled" size="18" color="#ffffff" style="padding-left: 10rpx;"></uni-icons>
			</view>
			<view style="display: flex;padding-top: 10rpx;font-size: 24rpx;">
				<view style="color:#ffffff;flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center;">
					<view>
						<qiun-data-charts style="width: 200rpx;height: 200rpx;" type="arcbar" :opts="ring_opt1" :chartData="chartsDataArcbar1"/>
					</view>
					<view style="line-height: 1rem;text-align: center;padding-top: 10rpx;">
						<text>参与票/总票数</text>
						<br/>
						<text>1573/{{details.ticketall}}</text>
					</view>
				</view>
				<view style="color:#ffffff;flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center;font-size: 24rpx;">
					<view>
						<qiun-data-charts style="width: 200rpx;height: 200rpx;" type="arcbar" :opts="ring_opt2" :chartData="chartsDataArcbar2"/>
					</view>
					<view  style="line-height: 1rem;text-align: center;padding-top: 10rpx;">
						<text>参与面积/总面积</text> 
						<br/>
						<text>1573.23/{{details.areaall}}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="display: flex;">
			<view style="flex: 1;padding: 20rpx 0 20rpx 30rpx;background-color: #e2fffc;color: #00a292;">
				<view>开始</view>
				<view>{{details.startat}}</view>
			</view>
			<view style="flex: 1;padding: 20rpx 0 20rpx 30rpx;background-color: #fff0e7;color: #f26b14;">
				<view>结束<text style="color: #ffaf7b;font-size: 24rpx;display: inline-block;padding-left: 16rpx;">共{{getDays(details.startat,details.endat)}}天</text></view>
				<view>{{details.endat}}</view>
			</view>
		</view>
		<view class="na-card bg-white p-30">
			<template v-if="!user_vote">
				<view style="text-align: right;">
					<span class="na-tag1" >可选{{details.vmax}}人 已选{{choose_opt}}人</span>
				</view>
				<view class="toupiaobox" v-for="(item,i) in vote_opt" :key="item.val">
					<view style="font-size: 32rpx;">
						<uni-icons type="chat" size="20" color="#00b7bd" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
						{{item.name}}
					</view>
					<view style="display: flex;align-items: center;justify-content: space-between;padding-top: 40rpx;">
						<view :class="{'on':item.opt&&item.opt.key==opt.key}" @click="clickFuncChooseVoteOpt(item,opt)" class="hand-class-item bg-light-grey" :style="{'color':opt.key==opts_all.vote_toupiao[0].key?'#00a292':opt.key==opts_all.vote_toupiao[1].key?'#aaaaaa':'#f26b14'}" v-for="(opt,j) in opts_all.vote_toupiao" :key="opt.key">
							<uni-icons :type="opt.key==opts_all.vote_toupiao[0].key?'hand-up-filled':opt.key==opts_all.vote_toupiao[1].key?'trash':'hand-down-filled'" size="40" :color="opt.key==opts_all.vote_toupiao[0].key?'#00a292':opt.key==opts_all.vote_toupiao[1].key?'#aaaaaa':'#f26b14'" style="padding-right: 6rpx;font-weight: 900;"></uni-icons>
							<view class="font-item">{{opt.val}}</view>
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<view>
					<span  v-if="opts_all.step_yt_type[3]&&steptype==opts_all.step_yt_type[3].key">我的表决</span>
					<span v-else-if="opts_all.step_yt_type[2]&&steptype==opts_all.step_yt_type[2].key">我的投票</span>
				</view>
				<view class="flex-row" v-for="(item,i) in user_vote.voteconts">
					<view class="font-grey" style="word-break: break-word;margin-right: auto;line-height: 1.1rem;">{{item.name || item.optid}}</view>
					<view style="white-space: nowrap;margin-left: 40rpx;" :style="{'color':item.sure==opts_all.vote_toupiao[0].key?'#00a292':item.sure==opts_all.vote_toupiao[1].key?'#aaaaaa':'#f26b14'}">{{getFuncOptVal(opts_all.vote_toupiao,item.sure)}}</view>
				</view>
				<!-- <view style="display: flex; color: #aaaaaa;padding: 20rpx 0;">
					<view style="flex: 1;text-align: center;">
						<text style="color: #00b7bd;font-size: 32rpx;font-weight: 600;">赞成</text>
						<br/>
						<text >我的表决</text>
					</view>
					<view style="flex: 1;text-align: center;">
						<text style="color: #00b7bd;font-size: 32rpx;font-weight: 600;">1</text>
						<br/>
						<text>我的票数</text>
					</view>
					<view style="flex: 1;text-align: center;">
						<text style="color: #00b7bd;font-size: 32rpx;font-weight: 600;">89.89</text>
						<br/>
						<text>我的面积</text>
					</view>
				</view> -->
				<view style="color: #aaaaaa;display: flex;flex-wrap: wrap;">
					<view  v-if="opts_all.step_yt_type[3]&&steptype==opts_all.step_yt_type[3].key">表决时间：</view>
					<view  v-else-if="opts_all.step_yt_type[2]&&steptype==opts_all.step_yt_type[2].key" >投票时间：</view>
					<view style="color: #333333;">{{user_vote.created_at}}</view>
				</view>
				<view style="color: #aaaaaa;display: flex;">
					<view style="white-space: nowrap;">涉及房屋：</view>
					<view style="flex-grow: 1;">
						<view style="display: flex;" v-for="(item,i) in user_vote.votehouses" >
							<view style="color: #333333;margin-right: auto;line-height: 1.1rem;word-break: break-word;">{{item.name||item.hid}}</view>
							<view style="color: #333333;margin-left: 16rpx;white-space: nowrap;">{{item.area_build}}平米</view>
						</view>
					</view>
				</view>
				<view style="font-size: 24rpx;color: #00b7bd;text-align: right;display: flex;justify-content: space-between;padding: 20rpx 0;">
					<view style="font-size: 32rpx;">
						投票数据统计
					</view>
					<view>
						<!-- 查看详细 -->
						<uni-icons type="help-filled" size="18" color="#00b7bd" style="padding-left: 10rpx;"></uni-icons>
					</view>
				</view>
				<view>
					<view class="column-box">
						<view class="item-col">
							<view class="item-col-bt bg-col1"></view>
							<view>赞成占比</view>
						</view>
						<view class="item-col">
							<view class="item-col-bt bg-col2"></view>
							<view>弃权占比</view>
						</view>
						<view class="item-col">
							<view class="item-col-bt bg-col3"></view>
							<view>反对占比</view>
						</view>
					</view>
					<view class="detail-box">
						<view class="detail-item">面积占比：64.25%</view>
					</view>
					<view class="pic-box">
						<view class="pic-line-50"></view>
						<view class="pic-line-0"></view>
						<view class="pic-item">
							<view class="pic-l-r">
								<view class="pic-bt" >
									<view class="pic-item-bt-item bg-col1" :style="{height:`${50*2}rpx`}"></view>
								</view>
								<view>票数</view>
							</view>
							<view class="pic-l-r">
								<view class="pic-bt">
									<view class="pic-item-bt-item bg-col1"></view>
								</view>
								<view>面积</view>
							</view>
						</view>
						<view class="pic-item">
							<view class="pic-l-r">
								<view class="pic-bt" :class="{'on':true}">
									<view class="pic-item-bt-item bg-col2"></view>
								</view>
								<view>票数</view>
							</view>
							<view class="pic-l-r">
								<view class="pic-bt">
									<view class="pic-item-bt-item bg-col2"></view>
								</view>
								<view>面积</view>
							</view>
						</view>
						<view class="pic-item">
							<view class="pic-l-r">
								<view class="pic-bt">
									<view class="pic-item-bt-item bg-col3"></view>
								</view>
								<view>票数</view>
							</view>
							<view class="pic-l-r">
								<view class="pic-bt">
									<view class="pic-item-bt-item bg-col3"></view>
								</view>
								<view>面积</view>
							</view>
						</view>
					</view>
				</view>
				<view class="piaoshu-mianji">
					<view class="piaoshu-item-mianji">
						<view>票数：321</view>
						<view>面积：99999.22</view>
					</view>
					<view class="piaoshu-item-mianji">
						<view>票数：321</view>
						<view>面积：99999.22</view>
					</view>
					<view class="piaoshu-item-mianji">
						<view>票数：321</view>
						<view>面积：99999.22</view>
					</view>
				</view>
			</template>
		</view>
		<uni-popup ref="popup" type="center"  :mask-click="false" >
			<view class="box" style="width: 80vw;">
				<view class="tit">
					请认真核对你的选票，一旦提交无法修改
				</view>
				<view class="cont">
					<view style="width: 100%;">
						<view class="cont-list" v-for="(item,i) in vote_opt" :key="'ticket'+i">
							<view class="name">
								{{item.name}}
							</view>
							<view class="ticket" :class="getClass(item.opt)">
								{{item.opt&&item.opt.val || '未选择'}}
							</view>
						</view>
					</view>
				</view>
				<view class="buts">
					<view class="item left" @tap="close()">取消</view>
					<view class="item right" @tap="confirm()">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import {
		getVoteOptList,
		getVoteDetails,
		postUserVote,
		getUserVoteDetails,
		getVoteOptDetails,
		getHouseDetails
	} from './service/api.js'
	export default {
		name: 'berVoteUser',
		props: ['voteid','steptype'],
		watch: {
			voteid: {
				handler(new_val) {
					this.id = new_val
					if(this.id){
						this.getFuncVoteOptDetails()
					}
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				opts_all:{
					vote_toupiao:[],
					step_yt_type:[]
				},
				id:'',
				details:'',
				ring_opt1: {
					title:{
						name:'80%',
						color:'#ffffff',
						fontSize:18
					},
					subtitle:{
						name:''
					},
					extra:{
						arcbar:{
							type:'circle',
							width:8,
							backgroundColor: '#00e7da',
							startAngle: 1.5
						}
					}
				},
				chartsDataArcbar1:{
					"series": [{
						"data": 0.8,
						"color": "#FFFFFF"
					}]
				},
				ring_opt2: {
					title:{
						name:'80%',
						color:'#ffffff',
						fontSize:18
					},
					subtitle:{
						name:''
					},
					extra:{
						arcbar:{
							type:'circle',
							width:8,
							backgroundColor: '#00e7da',
							startAngle: 1.5
						}
					}
				},
				chartsDataArcbar2:{
					"series": [{
						"data": 0.8,
						"color": "#FFFFFF"
					}]
				},
				vote_opt:[],
				choose_opt:0,
				user_vote:null,
			}
		},
		created() {
			getOpts(['vote_toupiao','step_yt_type']).then(res => {
				this.opts_all = res
			})
		},
		methods: {
			// 获取投票详情
			getFuncUserVoteDetails(){
				getUserVoteDetails(this.id).then(res=>{
					let data = res.data
					this.user_vote = ''
					if(data){
						let promiseList = []
						for(let i in data.voteconts){
							promiseList.push(new Promise((reslove, reject) => {
								getVoteOptDetails(data.voteconts[i].optid).then(res2=>{
									data.voteconts[i].name = res2.data.name
									reslove(res2)
								}).catch(err=>{
									reslove(err)
								})
							}));
						}
						for(let i in data.votehouses){
							promiseList.push(new Promise((reslove, reject) => {
								getHouseDetails(data.votehouses[i].hid).then(res2=>{
									data.votehouses[i].name = res2.data.name
									reslove(res2)
								}).catch(err=>{
									reslove(err)
								})
							}));
						}
						Promise.all(promiseList).then(res2=>{
							this.user_vote = data
							console.log(this.user_vote)
						})
					}
				})
			},
			// 弹窗
			getClass(str){
				if(str){
					switch(str.val) {
					 case this.opts_all.vote_toupiao[0].val:
						return 'a-green'
						break;
					 case this.opts_all.vote_toupiao[1].val:
						return 'a-blue'
						break;
					 case this.opts_all.vote_toupiao[2].val:
						return 'a-red'
						break;
					} 
				}
				return ''
			},
			close(){
				this.choose_opt = 0
				for(let i in this.vote_opt){
					this.vote_opt[i].opt = ''
				}
				this.$refs.popup.close()
			},
			confirm(){
				let data = {
					optid:[],
					optval:[]
				}
				for(let i in this.vote_opt){
					if(this.vote_opt[i].opt){
						data.optid.push(this.vote_opt[i].id)
						data.optval.push(this.vote_opt[i].opt.key)
					}
				}
				postUserVote(this.id,data).then(res=>{
					uni.showToast({
						icon:'none',
						title:res.msg
					})
					setTimeout(()=>{
						this.close()
						this.getFuncVoteOptDetails()
					},1000)
				})
			},
			clickFuncChooseVoteOpt(vote,opt){
				vote.opt = opt
				this.choose_opt = 0
				for(let i in this.vote_opt){
					if(this.vote_opt[i].opt){
						this.choose_opt ++
					}
				}
				if(this.choose_opt>=this.details.vmax){
					this.$refs.popup.open()
				}
			},
			// 相隔几天
			getDays(strDateStart, strDateEnd) {
				return Math.ceil((new Date(strDateEnd).getTime() - new Date(strDateStart).getTime())/1000/60/60/24);
			},
			// 初始化
			getFuncVoteOptDetails(){
				getVoteDetails(this.id).then(res=>{
					this.details = res.data
					getVoteOptList({vid:this.id}).then(res=>{
						for(let i in res.data){
							res.data[i].opt = ''
						}
						this.vote_opt = res.data
					})
					this.getFuncUserVoteDetails()
				}).catch(err=>{
					this.details = ''
				})
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>
<style lang="scss" scoped>
	.bjnr-bg{
		background:$uni-bg-color-gradient-a;
		border-radius:12rpx;
		box-sizing: border-box;
		padding: 20rpx;
	}
	.column-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item-col{
			flex: 1;
			display: flex;
			align-items: center;
			white-space: nowrap;
			font-size: 24rpx;
			color: #aaaaaa;
			justify-content: center;
			.item-col-bt{
				width: 70rpx;
				height: 40rpx;
				background-color: #eeeeee;
				margin-right: 10rpx;
				border-radius: 6rpx;
			}
		}
	}
	.bg-col1{
		background: linear-gradient(to top, #00b7bd 0%, #00d5c0 100%);
	}
	.bg-col2{
		background: linear-gradient(to top, #a3a3a3 0%, #c6c6c6 100%);
	}
	.bg-col3{
		background: linear-gradient(to top, #ff914a 0%, #ffa772 100%);
	}
	.pic-box{
		display: flex;
		justify-content: space-between;
		padding-top: 20rpx;
		.pic-item{
			width: 30%;
			display: flex;
			justify-content: center;
			position: relative;
			z-index: 1;
			.pic-l-r{
				width: 40%;
				font-size: 24rpx;
				color: #aaaaaa;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				.pic-bt{
					border-radius:6rpx;
					padding: 20rpx 20rpx 0 20rpx;
					.pic-item-bt-item{
						height: 200rpx;
						border-radius:6rpx;
					}
				}
				.pic-bt.on{
					background-color: #eafbf9;
				}
			}
		}
	}
	
	.pic-box{
		position: relative;
		.pic-line-50{
			position: absolute;
			left: 0;
			width: 100%;
			height: 4rpx;
			background-color: #eeeeee;
			top: 50%;
		}
		.pic-line-50::after{
			position: absolute;
			content: '50%';
			font-size: 24rpx;
			color: #aaaaaa;
			left: -32rpx;
			top: -40rpx;
		}
		.pic-line-0{
			position: absolute;
			left: 0;
			width: 100%;
			height: 4rpx;
			background-color: #eeeeee;
			bottom: 44rpx;
		}
	}
	.detail-box{
		display: flex;
		padding-top: 40rpx;
		justify-content: flex-end;
		.detail-item{
			border-radius: 6rpx;
			padding: 16rpx 20rpx;
			background-color: #d3f7f3;
			color: #aaaaaa;
		}
	}
	.piaoshu-mianji{
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #aaaaaa;
		.piaoshu-item-mianji{
			flex: 1;
			line-height: 1rem;
		}
	}
	.hand-class-item{
		flex-direction: column;
		justify-content: center;
		width:30%;
		display:flex;
		align-items:center;
		padding: 50rpx 0 30rpx 0;
		border-radius: 12rpx;
		
		.font-item{
			padding-top: 20rpx;
		}
	}
	.hand-class-item.on{
		background: #e2fffc!important;
	}
	.toupiaobox{
		margin-bottom: 40rpx;
	}
	.toupiaobox:last-child{
		margin-bottom: 0;
	}
	
	.box{
		width: 100%;
		border-radius: 30rpx;
		background-color: #FFFFFF;
		overflow: hidden;
		.tit{
			margin: 0 auto;
			width: 90%;
			text-align: center;
			display: flex;
			justify-content: center;
			padding-top: 30rpx;
			padding-bottom: 10rpx;
			color: #f0ad4e;
		}
		.cont{
			box-sizing: border-box;
			width: 100%;
			margin: 0 auto;
		    display: flex;
		    flex-direction: row;
		    justify-content: center;
		    align-items: center;
		    padding: 10rpx 30rpx 30rpx 30rpx;
			font-size: 28rpx;
			color: #6e6e6e;
			
			.cont-list{
				display: flex;
				border-bottom: 1px solid #f7f7f7;
				padding: 6px 0px;
				align-items: center;
				box-sizing: border-box;
				.name{
					flex: 8;
					text-align: right;
					box-sizing: border-box;
					padding-right: 20rpx;
					// text-align: left;
					text-align: justify;
				}
				.ticket{
					flex: 4;
					text-align: center;
				}
				.a-red{
					color: #EE7B7B;
				}
				.a-green{
					color: #7DBE7D;
				}
				.a-blue{
					color: #72C8D2;
				}
			}
		}
		.buts{
			width: 100%;
			margin: 0 auto;
			display: flex;
			>.item{
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 90rpx;
				font-size: 14px;
				line-height: 90rpx;
				border-top-color: #f0f0f0;
				border-top-style: solid;
				border-top-width: 2rpx;
			}
				
			>.left{
				border-right-color: #f0f0f0;
				border-right-style: solid;
				border-right-width: 2rpx;
			}
			// >.right{
			// 	border-left-color: #f0f0f0;
			// 	border-left-style: solid;
			// 	border-left-width: 2rpx;
			// }
		}
	}
	 ::v-deep .uni-popup__wrapper {
		padding: 0!important;
	}
</style>
