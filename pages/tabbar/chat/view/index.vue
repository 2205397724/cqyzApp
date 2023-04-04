<template>
    <view>
		<view class="na-main p-b-20">
			<surplus-hair></surplus-hair>
			<view class="size-lx strong p-t-30">消息</view>
		</view>
		<!-- <view class="na-main">
			<view class="m-tb-40 flex-row">
				<view class="p-r-40 flex-column flex-center">
					<view class="badge-base badge-circle bg-white p-20">
						<image src="/static/chat/systemable.png" mode="widthFix"></image>
					</view>
					<view class="size-base font-darkgrey p-t-20">系统消息</view>
				</view>
				<view class="p-lr-40">
					<view class="flex-column flex-center">
						<view class="badge-base badge-circle bg-white p-20">
							<image src="/static/chat/interativeable.png" mode="widthFix"></image>
						</view>
						<view class="size-base font-darkgrey p-t-20">互动消息</view>
						<view class="tag-sm">6</view>
					</view>
				</view>
				<view class="p-l-40 flex-column flex-center">
					<view class="badge-base badge-circle bg-white p-20">
						<image src="/static/chat/atable.png" mode="widthFix"></image>
					</view>
					<view class="size-base font-darkgrey p-t-20">@我的</view>
				</view>
			</view>
		</view> -->
		<view class="p-lr-20 p-tb-30">
			<v-tabs v-model="search_active_state" :tabs="list_status" @change="changeTab" field="val"></v-tabs>
		</view>
        <mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main">				
				<!-- 渲染的信息 -->
				<view class="bg-white p-30 na-card m-b-20" v-for="(item,i) in user_message_list">
					<view class="flex-row flex-start" @tap="towindow(item)">
						<view class="badge-sm border-radius-base bg-light-green p-30">
							<image src="/static/chat/systemable.png" mode="widthFix"></image>
						</view>
						<view class="p-l-20">
							<view class="size-base">{{item.notice.title}}</view>
							<view class="size-sm font-grey p-t-10">{{item.notice.created_at}}</view>
						</view>
						<view class="na-unread" v-if="item.isread==0"></view>
					</view>
				</view>
			</view>
        </mescroll-body>
    </view>
</template>
<script>

import Cache from '@/pages/framework/utils/cache/cache.js'
import { USER_INFO } from '@/pages/framework/config/cache.js'
import {getMessageList} from '../service/api.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'	
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
			//接收用户信息列表
			user_message_list:[],
			total:0,
			nid:'',
			// 消息数量
			message_count:'',
			search_active_state:0,
			list_status:[{
				key:999,
				val: '全部'
			},{
				key:0,
				val: '未读'
			},{
				key:1,
				val: '已读'
			}],
        }
    },
	onShow() {
		uni.showTabBar()
	},
    onLoad() {
		
    },
    methods: {
        /* 上拉加载的回调*/
        upCallback(page) {
            // this.mescroll.endSuccess(1)
			let data = {
				page: page.num,
				per_page: page.size,
				
			}
			if(this.search_active_state>0){
				data.isread =this.list_status[this.search_active_state].key
			}
			if(page.num==1){
				this.user_message_list =[]
			}
			getMessageList(data).then(res=>{
				this.user_message_list = this.user_message_list.concat(res.data)
				this.message_count = this.user_message_list.length
				this.mescroll.endSuccess(this.user_message_list.length)
			}).catch(err=>{
				this.mescroll.endErr(err)
			})
        },
        // 下拉刷新回调
        downCallback() {
            this.mescroll.resetUpScroll()
        },
		towindow(item){
			this.nid = item.nid
			this.utils.route("/pages/chat/window/window?notice="+this.nid)
		},
		changeTab(index) {
			this.search_active_state = index
			this.downCallback()
		},
    }
}
</script>
<style lang="scss" scoped>
	
</style>
