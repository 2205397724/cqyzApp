<template>
	<view>
		<view>
			<button v-if="opts_all.step_yt_type[3]&&steptype==opts_all.step_yt_type[3].key" type="primary" style="margin-bottom: 20rpx;" @click="clickFuncAdd">添加表决事件</button>
			<button v-else-if="opts_all.step_yt_type[2]&&steptype==opts_all.step_yt_type[2].key" type="primary" style="margin-bottom: 20rpx;" @click="clickFuncAdd">添加投票事件</button>
		</view>
		<view>
			<!-- 禁止滑动 -->
			<radio-group @change="radioChange">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item,i) in vote_data" :key="item.id" class="m-b-20">
						<view class="na-card bg-white p-30  size-lg"  @click="clickFuncDetails(item.id)" style="display: flex;">
							<view>{{item.name}}</view>
							<radio style="margin-left: auto;" :value="item.id" @click.stop="()=>{}"/>
						</view>
						<template v-slot:right>
							<view @click="clickFuncdelteVote(item.id)" style="padding: 0 40rpx; background-color: #dd524d;color:#ffffff;display: flex;align-items: center;" class="bg-red" >删除</view>
						</template>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</radio-group>
		</view>
	</view>
</template>

<script>
	// 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {ZONE} from "@/pages/framework/config/cache.js"
	import {
		getVoteList,
		deleteVote
	} from './service/api.js'
	export default {
		props:['url','steptype'],
		data() {
			return {
				zone: '',
				vote_data: [],
				opts_all:{
					vote_or_biaojue:[],
					step_yt_type:[]
				},
			}
		},
		created() {
			getOpts(['vote_or_biaojue','step_yt_type']).then(res => {
			    this.opts_all = res
			})
			this.zone = this.utils.getUserZone()
			this.getFuncVoteList()
		},
		methods: {
			//单选事件
			radioChange(val){
				this.$emit('chooseVote',val.detail.value)
			},
			// 删除事件
			clickFuncdelteVote(id){
				uni.showModal({
					title: '提示',
					content: '确定要删除么？',
					success:  (res)=> {
						if (res.confirm) {
							deleteVote(id).then(res=>{
								uni.showToast({
									icon:'none',
									title:res.msg
								})
								setTimeout(()=>{
									this.$emit('deleteVote',id)
									this.getFuncVoteList()
								},1000)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getFuncVoteList(){
				let data = {
					page:1,
					per_page:500,
					type:this.opts_all.vote_or_biaojue[1]?.key || 2,
					zid:this.zone.id
				}
				getVoteList(data).then(res=>{
					// this.vote_data = res.data.items
					this.vote_data = res.data
				})
			},
			// 添加表决事件
			clickFuncAdd(){
				this.utils.route(`/pages/survey/vote_add/vote_add`)
			},
			// 修改表决事件
			clickFuncDetails(id){
				this.utils.route(`/pages/survey/vote_add/vote_add?opt=${encodeURIComponent(JSON.stringify(id))}`)
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>

<style lang="scss" scoped >

</style>
