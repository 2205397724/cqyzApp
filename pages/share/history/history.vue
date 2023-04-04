<template>
	<view class="">
		<headbar title="过户申请"></headbar>
		<mescroll-body style="min-height: calc(100vh - 88rpx);" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption"
			:up="upOption">
            <view class="na-main m-t-30" v-if="share_list.length<=0">
            	<view class="na-card bg-white p-30 font-grey size-base">暂无过户申请</view>
            </view>
            <view class="na-main m-t-30" v-else>
                <uni-swipe-action>
                	<uni-swipe-action-item v-for="(item,i) in share_list" :key="item.id" class="m-b-20">
                		<view class="na-list">
                			<uni-row class="na-list-item na-card bg-white p-30">
                				<uni-col :span="24">
                					<view class="list-content" @click.stop="clickFuncDetails(item.id)">
                                        <view class="h2 over-ellipsis">业务编号：{{item.sno}}</view>
                						<view class="p-tb-10">
                						    <!-- 10待补充材料、11待公众补充材料、12待不动产中心补充材料、20已共享、40已结束共享、41公众主动放弃共享 -->
                							<text class="na-tag3" v-if="item.status === 10">待补充材料</text>
                						    <text class="na-tag1" v-else-if="item.status === 11">待公众补充材料</text>
                						    <text class="na-tag1" v-else-if="item.status === 12">待不动产中心补充材料</text>
                							<text class="na-tag1" v-else-if="item.status === 20">已共享</text>
                						    <text class="na-tag2" v-else-if="item.status === 40">已结束</text>
                                            <text class="na-tag2" v-else-if="item.status === 41">放弃共享</text>
                						</view>
                						<view class="font-grey size-base">
                							<view>申请人：{{item.uinfo.name}}</view>
                							<view>申请时间：{{item.updated_at}}</view>
                						</view>
                					</view>
                				</uni-col>
                			</uni-row>
                		</view>
                		<template v-slot:right>
                			<view @click="clickFuncDelte(item.id)" class="bg-red border-radius-base font-white size-base p-lr-40 flex-row flex-center">停止共享</view>
                		</template>
                	</uni-swipe-action-item>
                </uni-swipe-action>
            </view>
		</mescroll-body>
	</view>
</template>

<script>
    import {
        getShareRecord,
        stopShareRecord
    } from './service/api.js'
	import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixinK
		data() {
			return {
				VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				opts_all:{},
				downOption: {},
				upOption: {
				},
                share_list:[],//共享记录列表
                share_detail:{},//共享记录详情
                user_info:{},//用户信息
			}
		},
		onLoad() {
            this.user_info = this.utils.getUser()
		},
		methods: {
			// 上拉加载的回调
			upCallback(page) {
                let data = {
                    page: page.num,
                    per_page: page.size,
                    uid:this.user_info.id
                }
                if(page.num === 1) {
                    this.share_list = []
                }
                // console.log("Data",data);
                getShareRecord(data).then(res=>{
                    // console.log("res",res.data);
                    this.share_list = this.share_list.concat(res.data)
                    this.mescroll.endSuccess(res.data.length);
                }).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
            clickFuncDetails(id){
                this.utils.route(`/pages/share/detail/detail?id=${id}`)
            },
            clickFuncDelte(id) {
                // console.log("id",id);
                stopShareRecord(id).then(res=>{
                    uni.showToast({
                    	icon:'none',
                    	title:"已停止该记录的共享",
                        duration:1500
                    })
                    setTimeout(()=>{
                        this.downCallback()
                    },1500)
                })
            }
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		max-height: 70vh;
		min-height: 40vh;
		.popup-item{
			display: flex;
			padding: 10rpx 0;
			.popup-title{
				box-sizing: border-box;
				text-align: right;
			}
			.popup-content{
				
			}
		}
	}
</style>
