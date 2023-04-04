<template>
	<view>
		<view class="na-header-white">
			<headbar></headbar>
			<uni-row class="na-main">
				<uni-col :span="12">
					<picker :value="active_date" mode="date" fields="year" @change="res=>{active_date = res.detail.value}">
						<view class="na-search">
							<view class="na-search-item">
								<view class="item">
									<text class="size-lx strong">{{active_date}}年</text>
									<image class="image"></image>
								</view>
							</view>
						</view>
					</picker>
				</uni-col>
				<uni-col :span="12" class="font-grey size-sm align-right">
					已完成<text class="font-primary size-lg strong"> {{completed_num}}  </text>次  未完成<text class="font-extra size-lg strong"> {{uncompleted_num}} </text>次
				</uni-col>
			</uni-row>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- <view class="na-main">
				<view class="na-card bg-white m-b-30 p-30">
					<view class="size-lx strong">2月</view>
					<view class="font-grey size-sm">计划公示的内容</view>
					<view class="bg-linear-green2white na-card m-tb-10 p-20 flex-row flex-between">
						<view class="font-primary size-base">小区广告位收益</view>
						<view class="badge-success badge-sm"></view>
					</view>
					<view class="bg-linear-orange2white na-card m-tb-10 p-20 flex-row flex-between">
						<view class="font-extra size-base">物业企业巡检情况</view>
						<view class="badge-error badge-sm"></view>
					</view>
					<view class="bg-linear-grey2white na-card m-tb-10 p-20 flex-row flex-between">
						<view class="font-darkgrey size-base">物业企业巡检情况</view>
						<view class="badge-wait badge-sm"></view>
					</view>
				</view>
			</view> -->
			<view class="na-main" v-for="(item,index) in task_list">
				<view class="na-card bg-white m-b-30 p-30">
					<view class="size-lx strong">{{item[0].created_at.split(" ")[0].split("-")[1]}}月</view>
					<view class="font-grey size-sm">计划公示的内容</view>
					<view v-for="(items,i) in item">
						<view class="bg-linear-green2white na-card m-tb-10 p-20 flex-row flex-between" v-if="items.iscpt === 1" @click="showdetail(items.id,index,i)">
							<view class="font-primary size-base">{{items.cate.name}}</view>
							<view class="badge-success badge-sm"></view>
						</view>
						<view class="bg-linear-orange2white na-card m-tb-10 p-20 flex-row flex-between" v-else @click="showdetail(items.id,index,i)">
							<view class="font-extra size-base">{{items.cate.name}}</view>
							<view class="badge-error badge-sm"></view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<uni-popup ref="popup" type="bottom" >
			<view class="popup-box">
				<view class="flex-row size-base p-tb-10">
					<view class="font-grey">派发对象：</view>
					<view>{{group_from.name}}</view>
				</view>
				<view class="flex-row size-base p-tb-10">
					<view class="font-grey">接受对象：</view>
					<view>{{group_to.name}}</view>
				</view>
				<view class="flex-row size-base p-tb-10">
					<view class="font-grey">公示分类：</view>
					<view>{{announce_task_detail.cate}}</view>
				</view>
				<view class="flex-row size-base p-tb-10">
					<view class="font-grey">是否完成：</view>
					<view>
						<text v-if="announce_task_detail.iscpt === 0" class="badge-error badge-sm"></text>
						<text v-else  class="badge-success badge-sm"></text>
					</view>
				</view>
				<view class="flex-row size-base p-tb-10">
					<view class="font-grey">创建时间：</view>
					<view>{{announce_task_detail.created_at}}</view>
				</view>
				<view class="flex-row size-base p-tb-10">
					<view class="font-grey">更新时间：</view>
					<view>{{announce_task_detail.updated_at}}</view>
				</view>
				<view class="btn-extra btn-size-base btn-block" @click="toadd()" v-if="announce_task_detail.iscpt === 0">去完成任务</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { ZONE } from '@/pages/framework/config/cache.js'
	import {
		getAnnounceTaskList,
		getAnnounceTaskDetail,
		getGroupDetail,
		getGroupList
	} from "./service/api.js"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				active_date: new Date().getFullYear(),
				task_id:'',
				task_list:[],
				completed_num:0,//已完成公示数量
				uncompleted_num:0,//未完成公示数量
				group_from:[],//任务派发对象用户组
				group_to:[],//任务接收对象用户组
				announce_task_detail:[],//公示任务详情
				user_group:{},//用户所在用户组
				zone_detail:''
			}
		},
		onLoad() {
			this.getUserGroup()
			this.zone_detail = this.utils.getUserZone()
		},
		methods: {
			getUserGroup() {
				getGroupList().then(res=>{
					console.log("aaaa",this.zone_detail.china_code,res.data)
					for(let item of res.data) {
						if(this.zone_detail.china_code === item.region_cc) {
							this.user_group = item
							console.log("this.user_group",this.user_group)
						}
					}
				})
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				this.mescroll.endSuccess(1)
				this.getTask()
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			getTask() {
				if(!this.user_group.id) return
				let data = {
					page:1,
					per_page:10,
					to:this.user_group.id
				}
				getAnnounceTaskList(data).then(res=>{
					this.completed_num = 0
					this.uncompleted_num = 0
					let month = 1
					let index = 0
					this.task_list = []
					res.data.forEach(item => {
						item.iscpt ? this.completed_num++ : this.uncompleted_num++
						let m = month
						// 截取月份
						month = item.created_at.split(" ")[0].split("-")[1]
						// this.task_list.push(item)
						if(m != month) {
							// console.log("月份不相同",index)
							this.task_list.push([
								item
							])
							index++
						}else {
							// console.log("月份相同",index)
							if(index === 0) {
								this.task_list.push([
									item
								])
							}
							this.task_list[index-1].push(item)
						}
						// console.log("month",month,this.task_list)
					})
				})
			},
			showdetail(id,index,i) {
				getAnnounceTaskDetail(id).then(res=>{
					this.announce_task_detail = res.data
					this.announce_task_detail.cate = this.task_list[index][i].cate.name
					getGroupDetail(res.data.from).then(res=>{
						this.group_from = res.data
					})
					getGroupDetail(res.data.to).then(res=>{
						this.group_to = res.data
					})
				})
				this.task_id = id
				this.$refs.popup.open()
			},
			// 跳转公示添加页面
			toadd() {
				this.utils.route('/pages/announce/add/add?opt='+encodeURIComponent(JSON.stringify([this.task_id,this.group_to])))
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
