<template>
	<view>
		<view class="na-header-white">
			<headbar ></headbar>
			<view class="na-main p-t-30">
				<!-- <view class="size-lx strong">{{device_detail[0].content[0].name}}</view> -->
				<view class="size-lx strong">{{device_detail.name}}</view>
			</view>
			<view class="na-main p-t-30">
				<text class="font-grey size-base p-r-10">状态</text>
				<text class="na-tag1" v-if="device_detail.status == 1">正常</text>
				<text class="na-tag2" v-else-if="device_detail.status == 2">故障</text>
				<text class="na-tag2" v-else>维护中</text>
			</view>
		</view>
		<view class="p-lr-20  p-b-30">
			<v-tabs v-model="currentTab" :tabs="list_status" @change="changeTab" field="val"></v-tabs>
		</view>
        <mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- 基础信息 -->
			<view class="na-main" v-if="currentTab==0">
				<view class="na-card p-30 m-b-30 bg-white">
					<view class="flex-row flex-start p-tb-10" v-if="device_detail.zoneinfo">
						<text class="size-base font-grey">所在位置：</text>
						<text class="size-base font-darkgrey">{{device_detail.zoneinfo.name || ''}}</text>
						<text class="size-base font-darkgrey" v-if="device_detail.buildinginfo">{{device_detail.buildinginfo.name || ''}}</text>
						<text class="size-base font-darkgrey" v-if="device_detail.unitinfo">{{device_detail.unitinfo.name || ''}}</text>
					</view>
					<view class="p-tb-10">
						<text class="size-base font-grey">详细地址：</text>
						<text class="size-base">{{device_detail.addr}}</text>
					</view>
					<view class="p-tb-10">
						<text class="size-base font-grey">品牌：</text>
						<text class="size-base">{{device_detail.brand}}</text>
					</view>
					<view class="p-tb-10">
						<text class="size-base font-grey">编号：</text>
						<text class="size-base">{{device_detail.sno}}</text>
					</view>
					<view class="p-tb-10">
						<text class="size-base font-grey">分类：</text>
						<text class="size-base" v-if="device_detail.type === 1">设备</text>
						<text class="size-base" v-else-if="device_detail.type === 2">设施</text>
						<text class="size-base" v-else-if="device_detail.type === 3">部位</text>
						<text class="size-base" v-else>其他</text>
					</view>
					<view class="p-tb-10">
						<text class="size-base font-grey">提示信息：</text>
						<text class="size-base">{{device_detail.warn}}</text>
					</view>
					<!-- <view class="p-tb-10" v-if="device_detail.extra" v-for="(ext,e) in device_detail.extra" :key="e">
						<text class="size-base font-grey">{{ext.lab}}：</text>
						<text class="size-base">{{ext.val}}</text>
					</view> -->
				</view>
                <view class="na-title-sm">
                	其它
                </view>
                <view class="na-card p-30 bg-white">
                	<view class="line-height-170">
                		<view v-for="(item,i) in device_detail.extra" :key="i">
                			<view class="flex-row flex-start">
                				<text class="size-base font-grey">{{item.lab}}：</text>
                				<text class="size-base font-darkgrey">{{item.val}}</text>
                			</view>
                		</view>
                	</view>
                </view>
            </view>
			<!-- 维修记录 -->
			<view class="na-main" v-if="currentTab==1">
                <view class="na-card p-30 m-b-30 bg-white size-base" v-if="repair_list.length<=0">
                	暂无记录
                </view>
				<view class="na-card p-30 m-b-30 bg-white" 
					v-for="item in repair_list" 
					v-show="item.show">
                    <jyf-parser :html="item.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
					<!-- <view class="h2 over-ellipsis">{{item.content}}</view> -->
                    <view @click.stop="showRepairDetails(item.id)">
                        <view class="font-grey size-base p-t-20">
                        	<text class="p-r-20">时间：{{item.updated_at}}</text>
                        </view>
                        <view>
                            <!-- <text>资金来源：<text>{{item.money_src}}</text></text> -->
                            <text>资金来源：<text>{{ getFuncOptVal(opts_all.device_repair_money_src,item.money_src)  || "未知"}}</text></text>
                            <text class="m-l-40">使用资金：<text class="strong font-secondary">{{item.money}}</text>元</text>
                        </view>
                    </view>
				</view>
			</view>
			<!-- 日常管理 -->
			<view class="na-main" v-if="currentTab==2">
                <view class="na-card p-30 m-b-30 bg-white size-base" v-if="manage_list.length<=0">
                	暂无记录
                </view>
				<view class="na-card p-30 m-b-30 bg-white"
					v-for="item in manage_list" 
					v-show="item.show">
                    <jyf-parser :html="item.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
					<!-- <view class="h2 over-ellipsis">{{item.content}}</view> -->
                    <view @click.stop="showRepairDetails(item.id)">
                        <view class="font-grey size-base p-t-20">
                        	<text class="p-r-20">时间：{{item.updated_at}}</text>
                        </view>
                        <view>
                            <!-- <text>资金来源：<text>{{item.money_src}}</text></text> -->
                            <text>资金来源：<text>{{ getFuncOptVal(opts_all.device_repair_money_src,item.money_src)  || "未知"}}</text></text>
                            <text class="m-l-40">使用资金：<text class="strong font-secondary">{{item.money}}</text>元</text>
                        </view>
                    </view>
				</view>
			</view>
			<!-- 档案资料 -->
			<view class="na-main" v-if="currentTab==3">
                <view class="na-steps-column" v-for="(item,index) in archive_list">
                    <view class="na-steps-column-item" @click="getDeviceArchiveDetails(item.id,index)">
                    	<view class="steps-item-time">{{item.created_at}}</view>
                    	<text class="steps-item-discription">{{item.title}}</text>
                    	<view class="steps-item-content" v-if="enclosure[index]">
                    		<view class="flex-block">
                    			<view class="na-photo-box">
                    				<view class="photo-item" v-for="key in enclosure[index]">
                    					<view class="photo-item-image">
                    						<!-- <image @click="clickFuncImgShow(details.affixs,src)" :src="src" mode="aspectFill"></image> -->
                    						<image @click="clickFuncImgShow(enclosure[index],key)" :src="key" mode="aspectFill"></image>
                    					</view>
                    				</view>
                    			</view>
                    		</view>
                    	</view>
                    </view>
                </view>
				<!-- <view class="na-card p-30 bg-white">
					<view class="line-height-170" v-for="item in archive_detail.content">
						<view class="flex-row flex-start">
							<text class="size-base font-grey">{{item.type}}：</text>
							<text class="size-base font-darkgrey">{{item.name}}</text>
						</view>
					</view>
					<view class="flex-column">
						<view class="size-base font-grey">相关附件：</view>
						<view class="flex-block">
							<view class="na-photo-box">
								<view class="photo-item" v-for="item in enclosure">
									<view class="photo-item-image">
										<image @click="clickFuncImgShow(enclosure,item)" :src="item" mode="aspectFill"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view> -->
			</view>
		</mescroll-body>
		<!-- 维修记录详情弹窗 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup-box line-height-170">
				<view class="size-base">
					<text class="font-grey">类型：</text>
					<text class="font-dark" v-if="repair_detail.type === 1">日常维护</text>
					<text class="font-dark" v-else>维修记录</text>
				</view>
				<view class="size-base">
					<text class="font-grey size-base">项目名称：</text>
					<text class="font-dark">{{repair_detail.title}}</text>
				</view>
				<view class="size-base">
					<text class="font-grey size-base">详细记录：</text>
					<!-- <text class="font-dark">{{repair_detail.content}}</text> -->
                    <jyf-parser :html="repair_detail.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
				</view>
				<view class="size-base">
					<text class="font-grey size-base">使用金额：</text>
					<text class="font-dark">{{repair_detail.money}}</text>
				</view>
				<view class="size-base">
					<text class="font-grey size-base">维保时间：</text>
					<text class="font-dark">{{repair_detail.updated_at}}</text>
				</view>
				<view class="size-base">
					<text class="font-grey size-base">附件：</text>
                    <view class="flex-block">
                    	<view class="na-photo-box">
                    		<view class="photo-item" v-for="key in repair_detail.affixs">
                    			<view class="photo-item-image">
                    				<image @click="clickFuncImgShow(repair_detail.affixs,key)" :src="key" mode="aspectFill"></image>
                    			</view>
                    		</view>
                    	</view>
                    </view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	
	import {getDetail,
		getArchiveList,
		getArchiveDetails,
		getRepairList,
		getRepairDetails
	} from './service/api.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
    // 配置项
    import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
				currentTab: 0, // TAB选择项
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				list_status:[{
					key:1,
					val: '设备信息'
				},{
					key:2,
					val: '维修记录'
				},{
					key:3,
					val: '日常管理'
				},{
					key:4,
					val: '档案资料'
				}],
				did:'',//设备id
				device_detail:[],//设备详情
				repair_list:[],//设备维修记录
                manage_list:[],//设备日常维护
				repair_detail:[],//设备维修详情
				archive_detail:[],//设备档案详情
                archive_list:[],//设备档案列表
				enclosure:[],//附件
                opts_all:{},
			}
		},
		onLoad(ID) {
			this.did = ID.id
			console.log(this.did)
			this.getDeviceDetail()
            // 1大修基金 2公共收益 3物业企业出资 4保修期免费 99其他
            getOpts(['device_repair_money_src']).then(res => {
                this.opts_all = res
                console.log("opts",this.opts_all)
            })
		},
		methods: {
			// 预览图片
			clickFuncImgShow(arr,url){
				uni.previewImage({
					current:url,
					urls: arr,
				});
			},
			// 设备详情
			getDeviceDetail(){
				getDetail(this.did).then(res=>{
					// console.log(res.data)
					this.device_detail = res.data
					console.log('this.device_detail',this.device_detail)
				})
			},
			// 设备维修记录列表
			getDeviceRepairList(type){
				let data = {
					page: 1,
					per_page: 500,
					did:this.did,
                    type:type
				}
				getRepairList(data).then(res=>{
					console.log(res.data)
                    // 1日常维护 2维修记录
                    type == 2 ? this.repair_list = res.data : this.manage_list = res.data
					// this.repair_list = res.data
				})
			},
			// 设备维修记录详情
			getDeviceRepairDetails(id){
				getRepairDetails(id).then(res=>{
					// console.log(res.data)
					this.repair_detail = res.data
                    this.repair_detail.affixs = []
                    res.data.affix.forEach(element => {
                        this.repair_detail.affixs.push(VITE_APP_FOLDER_SRC+element)
                    })
				})
			},
			// 设备档案列表
			getDeviceArchiveList(){
				let data = {
					page: 1,
					per_page: 500,
					did:this.did
				}
				getArchiveList(data).then(res=>{
                    this.archive_list = res.data
				})
			},
			// 设备档案详情
			getDeviceArchiveDetails(id,index){
				getArchiveDetails(id).then(res=>{
					this.archive_detail = res.data
					// console.log(this.device_detail)
                    this.enclosure[index] = []
					this.archive_detail.content.forEach(element => {
						if(element.key){
							this.enclosure[index].push(VITE_APP_FOLDER_SRC+element.key)
						}
					})
					console.log("this.enclosure",this.enclosure)
                    // 强制重新渲染Vue示例，解决附件数据this.enclosure首次加载不显示要刷新才显示的问题
                    this.$forceUpdate()
				})
			},
			/* 上拉加载的回调*/
			upCallback(page) {
                this.changeTab(this.currentTab)
				this.mescroll.endSuccess(1)
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			changeTab(index) {
				this.currentTab = index
				if(this.currentTab === 1) {
					// 获取维修记录
					this.getDeviceRepairList(2)
				}else if(this.currentTab === 2) {
					// 获取日常管理
					this.getDeviceRepairList(1)
				}else if(this.currentTab === 3) {
					// 获取档案资料
					this.getDeviceArchiveList()
				}
			},
			// 展示维修记录详情(id为维修id)
			showRepairDetails(id){
				console.log(id)
				this.getDeviceRepairDetails(id)
				this.$refs.popup.open()
			},
            getFuncOptVal(arr,key){
            	return getOptVal(arr,key)
            },
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		max-height: 70vh;
		min-height: 40vh;
		.popup-item{
			display: flex;
			margin-bottom: 10rpx;
			.popup-title{
				min-width: 180rpx;
				// width: 160rpx;
				box-sizing: border-box;
				padding: 0 10rpx;
				text-align: right;
			}
			.popup-content{
				
			}
		}
	}
</style>
