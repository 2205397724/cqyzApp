<!--公示列表页-->
<template>
	<view>
		<view class="na-header announce-head">
			<headbar backgroundColor='linear-gradient(-90deg, #00b7bd, #00d5c0)' color="#fff"></headbar>
			<uni-row class="na-main">
				<uni-col :span="18">
					<view class="na-header-title">
						<text class="title">公示</text>
						<text class="info p-t-20">{{ zone_detail.name }}</text>
					</view>
				</uni-col>
				<uni-col :span="6"></uni-col>
			</uni-row>
			<view class="na-main" v-if="isYWH">
				<view class="na-header-tool-2">
					<uni-row class="announce-task">
						<uni-col :span="18" class="size-lg font-extra strong">小区公示任务</uni-col>
						<uni-col :span="6" class="align-right">
							<button class="btn-size-sm btn-extra" @tap="totask(1)">任务</button>
						</uni-col>
					</uni-row>
				</view>
			</view>
		</view>
		<view class="p-lr-20 announce-menu">
			<v-tabs v-model="search_active_state" :tabs="opts_all.announce_list_status" @change="tabFuncAnnounce"
				field="val"></v-tabs>
		</view>
		<view class="na-main p-t-20">
			<picker class="illegal-picker" @change="val=>{
				search_code = opts_all.article_lv_search[val.detail.value].key ;
				downCallback()
			}" mode='selector' :range="opts_all.article_lv_search" range-key="val">
				<view class="na-search" >
					<view class="na-search-item active" >
						<view class="item">
							<text class="font-grey size-sm font-primary" >{{getFuncOptVal(opts_all.article_lv_search,search_code) || '全部'}}</text>
							<image class="image"></image>
						</view>
					</view>
				</view>
			</picker>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- <view class="na-main announce-search">
				<view class="na-search"> 
					<view class="na-search-item" :class="{'active':search_active_type.value==item.value}" v-for="(item,i) in search_type_list" :key="item.value" @click="search_active_type=item">
						<view class="item">
							<text class="font-grey size-sm" :class="{'font-primary': search_active_type.value==item.value}">{{item.text}}</text>
							<image class="image"></image>
						</view>
					</view>
				</view>
			</view> -->
			<view class="na-main">
				<view class="na-list m-t-20">
					<uni-row class="na-list-item na-card bg-white m-b-30 p-30" v-for="(item,i) in announce_list" :key="item.id">
						<uni-col :span="6">
							<view class="list-cate" v-if="item.cate">{{item.cate.name}}</view>
						</uni-col>
						<uni-col :span="18">
							<view class="list-content" @tap="details(item.id)">
								<view class="h2 over-ellipsis">{{item.title}}</view>
								<view class="p-tb-20">
									<text v-for="(opt,i) in opts_all.announce_list_status" :key="i" v-show="opt.key==item.status" class="na-tag1" >{{opt.val}}</text>
									<text class="na-tag2" v-if="item.proof">{{item.proof}}</text>
								</view>
								<view class="list-info">
									<text class="font-grey size-sm p-r-20" v-if="item.authorgroup">{{item.authorgroup.name}}</text>
									<text class="font-grey size-sm" v-if="item.uinfo">{{ item.uinfo.nickname || item.uinfo.username}}</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
					
					<!-- <uni-row class="na-list-item na-card bg-white m-b-30 p-30">
						<uni-col :span="6">
							<view class="list-cate">经费收支</view>
						</uni-col>
						<uni-col :span="18">
							<view class="list-content" >
								<view class="h2 over-ellipsis">滨江一号C区7、8号楼排污主管网疏通整改使用物业专项维修资金公示</view>
								<view class="p-tb-20">
									<text class="na-tag2">重要</text>
									<text class="na-tag1">进行中</text>
								</view>
								<view class="list-info">
									<text>公示主体：业委会</text>
									<text>公示时间：2021-12-15</text>
								</view>
							</view>
						</uni-col>
					</uni-row> -->
					<!-- <uni-row class="na-list-item na-card bg-white p-30">
						<uni-col :span="24">
							<view class="list-content" >
								<view class="h2 over-ellipsis">滨江一号C区7、8号楼排污主管网疏通整改使用物业专项维修资金公示</view>
								<view class="na-unread"></view>
								<view class="p-tb-20">
									<text class="na-tag2">重要</text>
									<text class="na-tag1">进行中</text>
								</view>
								<view class="list-info">
									<text>公示主体：业委会</text>
									<text>公示时间：2021-12-15</text>
								</view>
							</view>
						</uni-col>
					</uni-row> -->
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import { ZONE } from '@/pages/framework/config/cache.js'
	import {
		getAnnounceList,
		getGroupList
	} from './service/api.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
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
				search_type_list: [{text:'按部门',value:0},{text:'按类别',value:1},{text:'按时间',value:2}],
				search_active_type:{text:'按部门',value:0},
				search_active_state: 0,
				announce_list: [],
				opts_all:{},
				zone_detail:'',
				isYWH:false,
				search_code:''
			}
		},
		onLoad(opts) {
			getOpts(['announce_list_status','article_lv_search']).then(res => {
				this.opts_all = res
			})
		},
		onShow() {		
			this.zone_detail = this.utils.getUserZone()
			this.isYWH = this.utils.isYwh()
		},
		methods: {
			/*tab切换*/
			tabFuncAnnounce(index) {
				this.search_active_state = index
				this.downCallback()
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					tovalcan: this.zone_detail.id,
					status:4//默认
				}
                // 小bug，配置信息还未获取完成，就已经触发下拉，this.opts_all.announce_list_status为undefined
                if(this.opts_all.announce_list_status) {
                    data.status = this.opts_all.announce_list_status[this.search_active_state].key
                }
				if(page.num==1){
					this.announce_list =[]
				}
				if(this.search_code&&this.search_code!=999){
					// data.lv = this.search_code
					data.totype = this.search_code
				}
				getAnnounceList(data).then(res=>{
					this.announce_list = this.announce_list.concat(res.data)
					this.mescroll.endSuccess(res.data.length);
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			totask(id){
				this.utils.route('/pages/announce/tasklist/tasklist?id='+id)
			},
			details(id){
				this.utils.route('/pages/announce/detail/detail?id='+id)
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.announce-head{
		margin-bottom:40rpx;
	}
	.announce-task{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.announce-menu{
		box-sizing: border-box;
		padding-top:30rpx;
		padding-bottom:10rpx;
	}
	.announce-search{
		box-sizing: border-box;
		padding-top:30rpx;
		padding-bottom: 20rpx;
	}
	.illegal-picker{
		display: inline-block;
	}
</style>
