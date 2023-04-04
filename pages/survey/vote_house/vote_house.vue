<template>
	<view>
		<headbar rightText="全选" @clickRight="clickFuncRight"></headbar>
		<view class="na-main">
			<view class="p-tb-20 font-grey">
				<view>名称：{{zone.name}}</view>
				<view>地址：{{zone.addr}}</view>
				<view>简介：{{zone.remark}}</view>
			</view>
		</view>
		<!--- 小区房屋信息 -->
		<view class="zones-detail">
			<view class="na-build-box">
				<view class="na-build-head">
					<view class="na-build-title">
						<view v-if="!build_list||build_list.length<=0" style="padding: 20rpx 0;">无楼栋信息！</view>
						<text :class="{'on':active_build.id==item.id}" v-for="(item,i) in build_list" :key="item.id" @click="()=>{active_build=item;getFuncUnit();active_unit=''}">{{item.name}}</text>
					</view>
					<view class="na-build-title">
						<view v-if="(!unit_list||unit_list.length<=0)&&build_list.length>0" style="padding: 20rpx 0;">无单元信息！</view>
						<text :class="{'on':active_unit.id==item.id}" v-for="(item,i) in unit_list" :key="item.id" @click="()=>{active_unit=item;getFuncHouse();}">{{item.name}}</text>
					</view>
				</view>
				<view class="na-build-body">
					<view v-if="(house_data.houses&&house_data.houses.length<=0)&&unit_list.length>0" style="padding: 20rpx 0;">无房屋信息！</view>
					<view class="na-build-line" v-for="(item,i) in house_data.houses" :key="item.floor_truth">
						<view class="loucen">{{item.floor_truth}}层</view>
						<view class="house_line">
							<text :class="{'on':child.selected}" @click.stop="clickFuncChooseHouse(child)" v-for="(child,j) in item.houses" :key="child.id">{{child.house_num}}#</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<button type="primary" style="margin-bottom: 20rpx;" @click="clickFuncSubmit">确定</button>
		</view>
		<uni-popup ref="popup" type="center" >
			<view style="width: 70vw;">
				<text>选择‘楼栋、单元’则保存当前单位下的所有房屋！选择‘房屋’则保存已勾选的房屋</text>
				<view style="display: flex;align-items: center;padding: 40rpx 0;">
					<view style="color: #aaaaaa;font-size: 12px;">
						选择：
					</view>
					<picker :value="active_type" :range="choose_type" range-key="text" @change="(res)=>{active_type=res.detail.value}">
						<view class="uni-input">{{ choose_type[active_type].text }}</view>
					</picker>
				</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="clickFuncBackClose">取消</text>
					<text class="uni-tip-button " @click="clickFuncGoBack">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {ZONE} from "@/pages/framework/config/cache.js"
	import {
		getBuilding,
		getUnit,
		getHouse,
		getZoneDetails,
		getHouseList
	} from './service/api.js'
	export default {
		data() {
			return {
				vote_id:'',
				zone: '',
				build_list: [],
				unit_list:[],
				house_data:{},
				active_build:'',
				active_unit:'',
				active_type:0,
				choose_type: [
					{value:'h',text:'房屋'},
					{value:'u',text:'单元'},
					{value:'b',text:'楼栋'}
				],
				active_house_old:[]
			}
		},
		onLoad(opts) {
			this.vote_id = JSON.parse(decodeURIComponent(opts.opt))
			this.zone = this.utils.getUserZone()
			getHouseList(this.vote_id).then(res=>{
				this.active_house_old = res.data
				this.getFuncZoneDetails(this.zone.id)
			})
		},
		methods: {
			// 全选
			clickFuncRight(){
				let anum = 0
				let tnum = 0
				for(let i in this.house_data.houses){
					for(let j in this.house_data.houses[i].houses){
						anum++
						if(this.house_data.houses[i].houses[j].selected){
							tnum ++
						}
					}
				}
				for(let i in this.house_data.houses){
					for(let j in this.house_data.houses[i].houses){
						if(anum == tnum){
							this.house_data.houses[i].houses[j].selected = false
						}else if(tnum<anum){
							this.house_data.houses[i].houses[j].selected = true
						}
					}
				}
			},
			// 取消
			clickFuncBackClose(){
				this.$refs.popup.close()
			},
			// 返回
			clickFuncGoBack(){
				this.$refs.popup.close()
				let data = {
					b: ''
				}
				if(this.choose_type[this.active_type].value=='h'){
					let old_house = []
					let active_house = []
					for(let i in this.house_data.houses){
						for(let j in this.house_data.houses[i].houses){
							if(this.house_data.houses[i].houses[j].selected){
								active_house.push(JSON.parse(JSON.stringify(this.house_data.houses[i].houses[j])))
							}
							for(let k in this.active_house_old){
								if(this.house_data.houses[i].houses[j].id == this.active_house_old[k]){
									old_house.push(JSON.parse(JSON.stringify(this.house_data.houses[i].houses[j])))
								}
							}
						}
					}
					let del_house = []
					for(let i in old_house){
						if(!old_house[i].selected){
							del_house.push(JSON.parse(JSON.stringify(old_house[i])))
						}
					}
					let add_house = []
					for(let i in active_house){
						let isadd = true
						for(let j in this.active_house_old){
							if(active_house[i].id==this.active_house_old[j]){
								isadd = false
								break
							}
						}
						if(isadd){
							add_house.push(JSON.parse(JSON.stringify(active_house[i])))
						}
					}
					data.h = {
						d:del_house,
						a:add_house
					}
				} else if(this.choose_type[this.active_type].value=='u'){
					data.u = this.active_unit
				}
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				prevPage.$vm.getBackData(data);   //修改上一页data里面的searchVal参数值为1211
				uni.navigateBack()
			},
			// 提交
			clickFuncSubmit(){
				this.$refs.popup.open()
			},
			// 选择房屋
			clickFuncChooseHouse(val){
				val.selected = !val.selected
			},
			// 获取小区详情
			getFuncZoneDetails(id){
				getZoneDetails(id).then(res=>{
					this.zone = res.data
					this.getFuncBuilding()
				})
			},
			// 获取楼栋
			getFuncBuilding(){
				let data = {
					page: 1,
					per_page: 500,
					zone_id: this.zone.id
				}
				getBuilding(data).then(res=>{
					// this.build_list = res.data.items
					this.build_list = res.data
					this.house_data =[]
					this.unit_list = []
					this.active_build = ''
					this.active_unit = ''
					if(this.build_list.length<=0){
						return false
					}
					this.active_build = this.build_list[0]
					this.getFuncUnit()
				})
			},
			// 获取单元
			getFuncUnit(){
				let data = {
					page: 1,
					per_page: 500,
					building_id: this.active_build.id
				}
				getUnit(data).then(res=>{
					// this.unit_list = res.data.items
					this.unit_list = res.data
					this.house_data = {}
					this.active_unit = ''
					if(this.unit_list.length<=0){
						return false
					}
					this.active_unit = this.unit_list[0]
					this.getFuncHouse()
				})
			},
			// 获取房屋
			getFuncHouse(){
				let data = {
					page: 1,
					per_page: 500,
					houseable_type: this.active_unit?'units':'buildings',
					houseable_id: this.active_unit.id || this.active_build.id
				}
				getHouse(data).then(res=>{
					for(let i in res.data.houses){
						for(let j in res.data.houses[i].houses){
							res.data.houses[i].houses[j].selected = false;
							for(let k in this.active_house_old){
								if(this.active_house_old[k] == res.data.houses[i].houses[j].id){
									res.data.houses[i].houses[j].selected = true;
									break
								}
							}
						}
					}
					
					this.house_data = res.data
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.zones-detail{
		padding: 0 5%;
		.title{
			font-size: $uni-font-size-lg;
			font-weight: 800;
			padding-bottom: 20rpx;
		}
		.label{
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
		}
		.content{
			font-size: $uni-font-size-base;
		}
		.row{
			padding: 10rpx;
		}
	}
	::v-deep .file-picker__box-content,
	::v-deep .uni-easyinput__content,
	::v-deep .uni-data-tree-input{
		background: #ffffff!important;
	}
	::v-deep .uni-tip-group-button {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
	
		.uni-tip-button {
			flex: 1;
			text-align: center;
			font-size: 32upx;
			color: #3b4144;
		}
	}
</style>
