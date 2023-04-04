<!-- 小区物业企业 -->
<template>
	<view>
		<view class="na-header-white">
			<headbar></headbar>
			<uni-row class="na-main">
				<uni-col :span="12">
					<text class="size-lx strong">我的房屋</text>
				</uni-col>
				<uni-col :span="12" class="font-grey size-sm align-right">
					<text class="p-r-30">
						<text class="font-primary size-lg strong">{{houseList.length}}</text> 套
					</text>
					<text class="btn-size-xs btn-extra" @tap="toBind">申请绑定</text>
				</uni-col>
			</uni-row>
			<view class="p-l-20 p-r-30 p-t-30 flex-row flex-between">
                <view>
                    <v-tabs v-model="currentTab" :tabs="tabList" @change="tabFun" field="val"></v-tabs>
                </view>
                <view class="font-grey size-sm" v-if="currentTab == 1" @click="openpop">选择企业</view>
			</view>
		</view>
		<!-- <view class="house-add_hd-mana na-main" style="display: flex;justify-content: space-between;margin-bottom: 20rpx;">
			<view class="house-add_hd-info"></view>
			<view class="house-add_hd-select">
				<label class="ui-radio">
					<radio :checked="bind_all" color="#12C4D0" @click="checkboxAllFunc"/>全选
				</label>
			</view>
		</view> -->
		<mescroll-body style="min-height: calc(100vh - 216rpx - 152rpx - 69rpx);" ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="na-main" v-for="(item,i) in houseList" :key="" style="margin-bottom: 40rpx;display: block;">
				<view class="na-card p-30 bg-white" style="display: flex;align-items: center;">
					<view style="flex-grow: 1; overflow: hidden;" @click.stop="clickFuncDetail(item)">
						<view class="flex-row flex-center flex-between ">
							<text class="size-lg ellipsis" :class="{'active':item.bind_def>0}" style="width: 100%; overflow: hidden;">{{item.name}}</text>
							<view v-if="item.id == defaultHouse.id" class="badge-sm badge-success"></view>
							<view v-else class="badge-sm badge-wait" @click.stop="putFuncNowHouse(item)"></view>
						</view>
						<view class="font-grey size-sm p-t-10 ellipsis">{{item.addr}}</view>
						<view class="p-t-20">
							<text class="na-tag1">{{getFuncOptVal(opts_all.house_status_plan_fact,item.status_fact) }}</text>
							<text class="na-tag2">{{item.area_build}} 平米</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<!-- <view class="has-house p-30">
			<view class="house-add_button">
				<button class="house-add_button-btn" type="primary" :disabled="checkbox_arr.length<=0" @click="oneKeyBindFunc">一键解绑</button>
			</view>
		</view> -->
		<!-- <uni-popup ref="popone" type="bottom">
			<scroll-view scroll-y="true" style="max-height: 70vh;">
				<view style="margin-bottom: 20rpx;">
					<view  style="font-size: 28rpx;color: #999999;">您已选择：</view>
					<view v-if="bind_all">解绑名下所有房屋！<view style="color: #aaaaaa;font-size: 24rpx;">？(如需解绑指定房屋，请取消全选，勾选指定房屋！)</view></view>
					<view v-else>
						<text class="na-tag1"  v-for="(item,i) in checkbox_arr" :key="item.id">{{ item.name }}</text>
						<view style="color: #aaaaaa;font-size: 24rpx;">？(如需解绑名下所有房屋，请勾选全选！)</view>
					</view>
				</view>
				<button type="primary" @click="bindFuncHouse">一键解绑</button>
			</scroll-view>
		</uni-popup> -->
		<!-- <uni-popup ref="popup" type="bottom" >
			<view class="popup-box">
				<icon type="clear" size="24" @click="closePopup" style="position: fixed;right: 20rpx;top: 20rpx;"/>
				<view class="popup-item">
					<view class="popup-title">房屋名称：</view>
					<view class="popup-content">{{details.name}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">地址：</view>
					<view class="popup-content">{{ details.addr }}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">房号：</view>
					<view class="popup-content">{{details.house_num}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">建筑面积：</view>
					<view class="popup-content">{{details.area_build}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">户型：</view>
					<view class="popup-content">{{ getFuncOptVal(opts_all.house_type_model,details.type_model)}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">产权性质：</view>
					<view class="popup-content">{{ getFuncOptVal(opts_all.house_type_property,details.type_property)}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">房屋使用状态：</view>
					<view class="popup-content">{{ getFuncOptVal(opts_all.house_status_use,details.status_use)}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">房屋安全状态：</view>
					<view class="popup-content">{{ getFuncOptVal(opts_all.house_status_safe,details.status_safe)}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">实际用途：</view>
					<view class="popup-content">{{ getFuncOptVal(opts_all.house_status_plan_fact,details.status_fact)}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">创建时间：</view>
					<view class="popup-content">{{details.created_at}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-title">修改时间：</view>
					<view class="popup-content">{{details.updated_at}}</view>
				</view>
				<view class="popup-item" v-if="details.addition">
					<view class="popup-title">备注说明：</view>
					<view class="popup-content">{{details.addition.desc}}</view>
				</view>
			</view>
		</uni-popup> -->
        <uni-popup ref="popup" type="top">
        	<view class="font-grey size-base border-b-grey p-b-20">选择您的企业</view>
        	<view class="flex-row flex-center flex-between p-tb-30 border-b-grey" v-for="item in companyList" :key="item.id">
        		<view>{{item.com_name}}</view>
        		<view @click="chooseCompany(item)">
                    <uni-icons type="checkbox" size="30" :color="item.id==company.id?'#00a292':'f5f5f5'"></uni-icons>
        		</view>
        	</view>
        </uni-popup>
	</view>
</template>

<script>
import Cache from "@/pages/framework/utils/cache/cache.js"
import { getHouseMe,getHouseCom,getZoneMe,getZoneCom,getHouseDetail,getCompanyList} from './service/api.js'
import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
			opts_all:{},
            // 下拉刷新的配置(可选, 绝大部分情况无需配置)
            downOption: {},
            // 上拉加载的配置(可选, 绝大部分情况无需配置)
            upOption: {
                noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
            },
			houseList: [],
			bind_all:false,
			checkbox_arr:[],
			details : '',
			defaultHouse : '',
			currentTab :0,
			tabList : [{
					key:0,
					val: '个人房屋'
				},{
					key:1,
					val: '企业房屋'
			}],
            companyList:[],
            company:{},
        }
    },
    onLoad() {
		getOpts(['house_status_plan_fact','house_type_model','house_type_property','house_status_use','house_status_safe']).then(res => {
		    this.opts_all = res
		})
    },
	onShow() {
        this.company = this.utils.getUserCompany()
		this.defaultHouse = this.utils.getUserHouse()
	},
    methods: {
		// 打开企业选择弹窗
        openpop() {
            this.$refs.popup.open()
            let data = {
                page:1,
                per_page:500
            }
            getCompanyList(data).then(res=>{
                this.companyList = res.data
            })
        },
		//选择企业
        chooseCompany(item) {
            this.utils.setUser('company',item)
            this.company = item
            this.$refs.popup.close()
			this.downCallback()
        },
		// 切换标签
		tabFun(index){
			this.currentTab = index
			this.mescroll.resetUpScroll()
		},
		closePopup(){
			this.$refs.popup.close()
		},
		//房屋详情
		clickFuncDetail(item){
			// 使用encodeURIComponent()对item数据进行编码传递参数
			this.utils.route(`/pages/page/house_details/house_details?id=${item.id}`)
			// getHouseDetail(item.id).then(res=>{
			// 	this.details = res.data
			// 	this.$refs.popup.open()
			// })
		},
		checkboxChange(val){
			let items = []
			for(let i in val.detail.value){
				items.push(JSON.parse(val.detail.value[i]))
			}
			this.checkbox_arr = items
			if(val.detail.value.length<this.houseList.length){
				this.bind_all = false
			}
		},
		// 全选
		// checkboxAllFunc(){
		// 	this.bind_all = !this.bind_all
		// 	for(let i in this.houseList){
		// 		this.houseList[i].selected = this.bind_all
		// 	}
		// 	this.checkbox_arr = []
		// 	if(this.bind_all){
		// 		this.checkbox_arr = this.houseList
		// 	}
		// },
		// 解绑房屋
		// bindFuncHouse(){
		// 	uni.showModal({
		// 		title: '一键解绑',
		// 		content: `确定要一键解绑当前选择的房屋么`,
		// 		success:  res => {
		// 			if (res.confirm) {
		// 				let check_data = {
		// 					type:2,
		// 					all:this.bind_all?1:0,
		// 				}
		// 				if(!this.bind_all){
		// 					check_data.hid = []
		// 					for(let i in this.checkbox_arr){
		// 						check_data.hid.push(this.checkbox_arr[i].id)
		// 					}
		// 				}
		// 				postCheckHouse(check_data).then(res=>{
		// 					postUnBindCheckHouse().then(res2=>{
		// 						this.checkbox_arr = []
		// 						this.bind_all = false
		// 						this.$refs.popone.close()
		// 						this.mescroll.resetUpScroll()
		// 					})
		// 				})
		// 			} else if (res.cancel) {
		// 				console.log('用户点击取消');
		// 			}
		// 		}
		// 	});
		// },
        /* 上拉加载的回调*/
        upCallback(page) {
			let data = {
				page: page.num,
				per_page: page.size
			}
			if(page.num==1){
				this.houseList =[]
			}
			if(this.currentTab==0){
                // 个人房屋
				getHouseMe(data).then(res=>{
					let items = res.data
					// for(let i in items){
					// 	items[i].selected = false
					// }
					this.houseList =  this.houseList.concat(items)
					//静默设置第一套为默认房屋
					if(Object.keys(this.defaultHouse).length==0){
						this.defaultHouse = res.data[0];
						this.utils.setUser('house',res.data[0])
					}				
					this.mescroll.endSuccess(items.length); 
				}).catch(err=>{
					this.mescroll.endErr()
				})
			}
			if(this.currentTab==1){
                // 企业房屋
                if(!this.company.id) {
                    uni.showToast({
                        title:'未选择企业',
                        icon:"none",
                        duration:1000
                    })
                    this.openpop()
					this.mescroll.endSuccess(1);
                    return
                }
                data.cert_id = this.company.id
				getHouseCom(data).then(res=>{
					let items = res.data
					this.houseList =  this.houseList.concat(items)
					//静默设置第一套为默认房屋
					if(!this.defaultHouse){
						this.defaultHouse = res.data[0];
					}				
					this.mescroll.endSuccess(items.length); 
				}).catch(err=>{
					this.mescroll.endErr()
				})
			}
        },
        // 下拉刷新回调
        downCallback() {
            this.mescroll.resetUpScroll()
        },
		// 设置当前房屋
		putFuncNowHouse(val){
			if(val.id !== this.defaultHouse.id){
				uni.showModal({
					title: '提示',
					content: `您需要设置[${val.name}]为默认房屋？`,
					success: res => {
						if (res.confirm) {
							this.defaultHouse = val;
							this.utils.setUser('house',val)
							uni.showToast({
								title:'设置成功',
								icon:"none"
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		},
		getFuncOptVal(arr,key){
			return getOptVal(arr,key)
		},
		toBind(){
			uni.navigateTo({
				url:'/pages/binding/choose/choose'
			})
		}
    }
}
</script>

<style lang="scss" scoped>
	.active{
		color: $uni-theme-primary;
	}
	.popup-box{
		max-height: 70vh;
		min-height: 40vh;
		.popup-item{
			display: flex;
			margin-bottom: 10rpx;
			.popup-title{
				min-width: 240rpx;
				box-sizing: border-box;
				padding: 0 10rpx;
				text-align: right;
			}
			.popup-content{
				
			}
		}
	}
</style>
