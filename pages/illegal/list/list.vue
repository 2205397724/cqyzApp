<!-- 小区违建-->
<template>
	<view>
		<view class="na-header-white">
			<headbar fixed title="小区违建"></headbar>
			<uni-row class="na-main p-tb-20 flex-row flex-center">
				<uni-col :span="18">
					<view class="size-lxx strong">违建</view>
					<view class="size-base p-t-10 font-grey">{{ zone_detail.name }} 所有违建</view>
				</uni-col>
				<uni-col :span="6" class="flex-row flex-end">
					<view class="btn-size-xs btn-extra font-primary" @tap="add()">发起违建</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="p-lr-20 p-tb-10">
			<v-tabs v-model="search_active_state" :tabs="list_status" @change="changeTab" field="val"></v-tabs>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- <view class="na-main announce-search " style="padding-top: 0;padding-bottom: 0;">
				<picker class="illegal-picker" @change="val=>{
					search_illegal = opts_all.is_illegal[val.detail.value].key ;
					downCallback()
				}" mode='selector' :range="opts_all.is_illegal" range-key="val">
					<view class="na-search" >
						<view class="na-search-item active" >
							<view class="item">
								<text class="font-grey size-sm font-primary" >{{getFuncOptVal(opts_all.is_illegal,search_illegal) || '按区域'}}</text>
								<image class="image"></image>
							</view>
						</view>
					</view>
				</picker>
			</view> -->
			<view class="na-main">
				<view class="na-list m-t-20" v-for="(item,i) in all_list">
					<uni-row class="na-list-item na-card bg-white p-30">
						<uni-col :span="24">
							<view class="list-content" @tap="details(item.id)">
								<view class="h2 over-ellipsis">{{item.title}}</view>
								<!-- <view class="na-unread"></view> -->
								<view class="p-tb-20">
									<text class="na-tag2" >{{getFuncOptVal(opts_all.toushu2_status,item.status)}}</text>
									<!-- <text class="na-tag1">物业服务</text> -->
								</view>
								<view class="list-info">
									<text v-if="item.uinfo">发现人：{{item.ano?'匿名业主':(item.uinfo.nickname || '匿名业主')}}</text>
									<text>违建时间：{{item.created_at}}</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import {
		getList
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { USER_INFO,ZONE } from '@/pages/framework/config/cache.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				search_illegal: 0,
				search_active_state:0,
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: { },
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				zone_detail:'',
				list_status:[{
					key:1,
					val: '全部违建'
				},{
					key:2,
					val: '我的违建'
				}],
				all_list: [],
				zone:'',
				user_info:'',
				opts_all:{
					'toushu2_status':[]
				},
			}
		},
		onLoad(opts) {
			this.zone_detail = JSON.parse(decodeURIComponent(opts.opt))
			this.zone = this.utils.getUserZone()
			this.user_info = this.utils.getUser()
			getOpts(['is_illegal','toushu2_status']).then(res => {
				this.opts_all = res
			})
		},
		methods: {
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					kind:this.opts_all.is_illegal?.[0]?.key||1,
				}
				if(this.list_status[this.search_active_state].key==2){
					data.uid = this.user_info.id
				}
				if(page.num==1){
					this.all_list =[]
				}
				getList(data).then(res=>{
					this.all_list =  this.all_list.concat(res.data)
					// this.mescroll.endByPage(res.data.length, res.data.aggregation.total_cnt);
					this.mescroll.endSuccess(1)
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			changeTab(index) {
				this.search_active_state = index
				this.downCallback()
			},
			details(id){
				this.utils.route('/pages/illegal/detail/detail?id='+id)
			},
			add(){
				this.utils.route('/pages/illegal/add/add')
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
