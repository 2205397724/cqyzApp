<!-- 小区业委会 -->
<template>
	<view>
		<view class="na-header" >
			<headbar backgroundColor='linear-gradient(-90deg, #00b7bd, #00d5c0)' color="#ffffff"></headbar>
			<uni-row class="na-main p-tb-30 flex-row flex-center">
				<uni-col :span="18">
					<view class="font-white size-lxx strong">业委会</view>
					<view class="font-white size-base p-t-10 opacity-80"> {{zone_detail.name}}小区业委会</view>
				</uni-col>
				<uni-col :span="6" class="flex-row flex-end">
					<view @click="openList" class="btn-size-xs font-primary " style="color: #ffffff;">历史记录</view>
				</uni-col>
			</uni-row>
		</view>
		<!--未成立业委会时显示提示信息，已成立则不显示-->
		<!-- <view class="na-main m-b-30" v-if="!zone_detail.bindywh||!zone_detail.bindywh.id"> -->
		<view class="na-main m-b-30" v-if="ywh_list.length<=0">
			<view class="na-card p-30 bg-white">
				<view class="flex-row flex-center flex-between">
					<text class="font-extra size-base">小区暂未成立业委会</text>
					<ber-route url="/pages/zones/change/change" class="btn-size-sm btn-extra">申请成立</ber-route>
				</view>					
			</view>
		</view>
		<!-- <view class="na-main m-b-30">
			<view class="na-card p-30 bg-white">
				<view class="flex-row flex-center flex-between">
					<text class="font-primary size-base">正在成立业委会筹备小组</text>
					<view class="btn-size-sm btn-primary" @click="clickFuncDetails">查看详情</view>
				</view>					
			</view>
		</view> -->
		<!-- <view class="na-main m-b-30" v-if="!zone_detail.bindywh||!zone_detail.bindywh.id"> -->
		<view class="na-main m-b-30" v-if="ywh_list.length<=0">
			<view class="na-card p-30 bg-white">
				<view class="na-title-sm">成立步骤</view>
					<scroll-view scroll-x="true" class="nowrap"> 
					<view class="inline-block p-30 step-item">
						<view class="flex-column flex-center drop-right-lg">
							<view class="badge-sm badge-circle bg-light-orange font-extra size-base">1</view>
							<view class="font-primary size-base p-10">提出申请</view>
							<view class="font-grey size-sm wrap">
								已交付使用的建筑面积达到50%以上
							</view>
						</view>
					</view>
					<view class="inline-block p-30 step-item">
						<view class="flex-column flex-center drop-right-lg">
							<view class="badge-sm badge-circle bg-light-orange font-extra size-base">2</view>
							<view class="font-primary size-base p-10">成立筹备组</view>
							<view class="font-grey size-sm wrap">
								街道办指导成立业主委员会筹备小组
							</view>
						</view>
					</view>
					<view class="inline-block p-30 step-item">
						<view class="flex-column flex-center drop-right-lg">
							<view class="badge-sm badge-circle bg-light-orange font-extra size-base">3</view>
							<view class="font-primary size-base p-10 wrap">拟定规则规约</view>
							<view class="font-grey size-sm wrap">
								拟定业主公约、业主委员会章程...
							</view>
						</view>
					</view>
					<view class="inline-block p-30 step-item">
						<view class="flex-column flex-center drop-right-lg">
							<view class="badge-sm badge-circle bg-light-orange font-extra size-base">4</view>
							<view class="font-primary size-base p-10 wrap">公开选举</view>
							<view class="font-grey size-sm wrap">
								业主下载APP参与投票
							</view>
						</view>
					</view>
					<view class="inline-block p-30 step-item">
						<view class="flex-column flex-center drop-right-lg">
							<view class="badge-sm badge-circle bg-light-orange font-extra size-base">5</view>
							<view class="font-primary size-base p-10 wrap">审核批复</view>
							<view class="font-grey size-sm wrap">
								经行政部门审核，给予书面批复意见
							</view>
						</view>
					</view>
					<view class="inline-block p-30 step-item">
						<view class="flex-column flex-center">
							<view class="badge-sm badge-circle bg-light-orange font-extra size-base">6</view>
							<view class="font-primary size-base p-10 wrap">完成</view>
							<view class="font-grey size-sm wrap">
								业委会选举完成
							</view>
						</view>
					</view> 
				</scroll-view>
			</view>
		</view>
		<!-- <view class="na-main" style="margin-bottom: 40rpx;" v-if="zone_detail.bindywh&&zone_detail.bindywh.id">-->
		<view class="na-main" style="margin-bottom: 40rpx;" v-if="ywh_details">
			<view class="na-card p-30 bg-white">
				<view>
					<text class="size-lg strong">{{ywh_details.name}}</text>
					<text class="na-tag1" v-if="ywh_details.active">生效</text>
					<text class="na-tag2" v-else>失效</text>
				</view>
				<!-- <view class="size-base font-grey p-t-10">服务时间：{{ywh_details.created_at}} 至 {{ywh_details.updated_at}}</view> -->
				<view class="p-tb-30 flex-row" v-for="item in filing_list">
                    <view class="btn-size-xs btn-primary btn-circle" @click="showFilingDetail(item.id)">{{item.title}}</view>
					<!-- <view class="bg-light-green font-primary size-base p-30 na-card m-r-20" @click="clickFuncYsgz">议事规则</view>
					<view class="bg-light-green font-primary size-base p-30 na-card "  @click="clickFuncGlgy">管理规约</view> -->
				</view>
				<view class="na-title-sm">业委会成员</view>
				<view class="m-b-20">
					<view class="font-grey size-base" v-if="ywh_details&&ywh_member.length<=0">无成员信息！</view>
					<view class="flex-row flex-center flex-between p-tb-10" v-for="(child,j) in ywh_member" :key="child.uid">
						<text class="size-base" style="width: 120rpx;">{{child.name||child.username}}</text>
						<text class="size-base font-grey">{{child.post}}</text>
						<view class="btn-size-xs btn-extra btn-circle">
							<safe-str style="width: auto;" size="38rpx" type="tel" :str="child.mobile" :show="true" :dial="true"></safe-str>
						</view>
					</view>
				</view>
				<!-- <view class="na-title-sm m-t-30">
					<text>业主评价</text>
					<text class="more">查看更多</text>
				</view>
				<view class="p-30 m-b-30 na-card bg-linear-orange2white">
					<view class="flex-row flex-between">
						<text class="size-base font-extra">3月服务评分</text>
						<text class="size-lx strong font-extra">93.58</text>
					</view>
				</view>
				<view class="flex-row wrap">
					<text class="na-tag1 m-b-10">态度好</text>
					<text class="na-tag1 m-b-10">楼长尽心尽力</text>
					<text class="na-tag2 m-b-10">很好的平台</text>
					<text class="na-tag2 m-b-10">很好</text>
					<text class="na-tag2 m-b-10">~楼长阿姨YYDS!</text>
				</view> -->
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<mescroll-body ref="mescrollRef"  style="max-height: 70vh;min-height: 40vh;"  :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view v-for="(item,i) in ywh_list" :key="item.id" @click="chooseFuncZone(item)" class="flex-row flex-center flex-between p-tb-30 border-b-grey">
					<view>
						<view class="h2 over-ellipsis" style="line-height: 1.2rem;" :class="{'active':item.id==active_id?true:false}">{{item.name}}</view>
						<!-- <view class="size-base font-grey p-t-10">服务时间：{{item.created_at}} 至 {{item.updated_at}}</view> -->
					</view>
					<view style="margin-left: 20rpx;">
						<uni-icons type="checkbox" size="30" :color="item.id==active_id?'#00a292':'999999'"></uni-icons>
					</view>
				</view>
			</mescroll-body>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getGroupList,
		getGroupDetail,
		getGroupMember,
		getCompanyDetail,
        getFilingList,
	} from './service/api.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				},
				zone_detail:'',
				ywh_details: '',
				active_id: '',
				ywh_list: [],
				ywh_member:[],
				group_id:'',//用户组id
                filing_list:[],//备案列表
			}
		},
		onLoad(opts) {
			this.zone_detail = JSON.parse(decodeURIComponent(opts.opt))
			// this.getFuncDetails()
			this.getCommittee()
		},
		methods: {
			getFuncDetails(){
				getGroupDetail(this.active_id).then(res=>{
					getGroupMember(res.data.id).then(res2=>{
						this.ywh_member  = res2.data
						this.ywh_details = res.data
					})
				})
			},
			openList(){
				this.$refs.popup.open()
			},
			chooseFuncZone(val){
				this.active_id = val.id
				this.getFuncDetails()
				this.$refs.popup.close()
			},
			clickFuncDetails(){
				uni.showToast({
					icon:'none',
					title:'无相关信息...'
				})
			},
			clickFuncYsgz(){
				uni.showToast({
					icon:'none',
					title:'无相关信息...'
				})
			},
			clickFuncGlgy(){
				uni.showToast({
					icon:'none',
					title:'无相关信息...'
				})
			},
			/* 上拉加载的回调*/
			upCallback(page) {
				let data = {
					page: page.num,
					per_page: page.size,
					type:6,
					region_val:this.zone_detail.id
				}
				if(page.num==1){
					this.ywh_list =[]
				}
				getGroupList(data).then(res=>{
					this.ywh_list =  this.ywh_list.concat(res.data)
					this.mescroll.endSuccess(res.data.length);
				}).catch(err=>{
					this.mescroll.endErr()
				})
			},
			// 下拉刷新回调
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			// 获取业委会
			getCommittee() {
				let data = {
					active:1,
					type:6,
					region_val:this.zone_detail.id
				}
				getGroupList(data).then(res=>{
                    if(res.data.length === 0) {
                        return
                    }
					this.ywh_list = res.data
					this.active_id = res.data[0].id
					this.ywh_details = res.data[0]
					// getGroupDetail(this.group_id).then(res=>{
					// 	console.log("res",res.data)
					// 	// this.company = res.data
					// 	// console.log("this.company",this.company.ref)
					// 	// 获取企业详情
					// 	// getCompanyDetail(this.company.ref).then(res=>{
					// 	// 	console.log("res",res.data)
					// 	// 	this.company_detail = res.data
					// 	// })
					// })
                    let data1 = {
                        zone_id:this.zone_detail.id,
                        group_id:this.active_id
                    }
                    getFilingList(data1).then(res=>{
                        // console.log("res",res.data);
                        this.filing_list = res.data
                    })
					getGroupMember(this.active_id).then(res=>{
						this.ywh_member = res.data
					})
				})
			},
            showFilingDetail(id) {
                this.utils.route(`/pages/zones/filing/filing?id=${id}`)
            }
		}
	}
</script>

<style lang="scss" scoped>
	.step-item{
		width: 200rpx;
	}
	.active{
		color: $uni-theme-primary;
	}
</style>
