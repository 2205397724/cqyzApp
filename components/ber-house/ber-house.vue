<template>
	<view>
		<uni-swipe-action>
			<uni-swipe-action-item class="m-b-20 ">
				<view class="na-card bg-white p-30 flex-row flex-center font-primary size-lg" @click="popFnOpen">
					<span >{{zone_details.name||'请选择'}} {{vote_house.length}}套</span>
				</view>
				<template v-slot:right>
					<view @click="clickFuncDeleteHouse" style="padding: 0 40rpx; background-color: #dd524d;color:#ffffff;display: flex;align-items: center;" class="bg-red" >删除所有</view>
				</template>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<uni-popup ref="popup1" type="bottom" >
			<view class="flex-row flex-between m-b-20">
				<view style="white-space: nowrap;" @click="popFnOk">确定</view>
				<!-- <view class="ellipsis m-lr-40 size-lg font-grey">春天花园</view> -->
				<view style="white-space: nowrap;" @click="popFnClose">取消</view>
			</view>
			<scroll-view v-if="crumbs.length>0" scroll-x="true" style="white-space: nowrap;min-height: 76rpx;">
				<text @click.stop="crumbsFn(item)"  style="display: inline-block;margin: 0 10rpx;padding: 16rpx 10rpx;font-size: 28rpx;color: #333333;" v-for="(item,i) in crumbs">{{item.text}}</text>
			</scroll-view>
			<scroll-view scroll-y="true" style="height: 60vh;">
				<view v-if="list.length<=0&&!house_data" style="width: 100%;text-align: center;padding: 20rpx 0;text-align: center;">
					~空空如也~
				</view>
				<view v-if="list.length>0&&!house_data" v-for="(item,i) in list" @click.stop="clickFnCity(item)" style="padding: 24rpx 30rpx;box-sizing: border-box;display: flex;align-items: center;justify-content: space-between;">
					<view style="display: flex;align-items: center;display: inline-flex;">
						<checkbox :value="JSON.stringify(item)" :checked="item.checked" style="transform:scale(0.7)" @click.stop="chooseFn(item)"/>
						<text>{{item.text}}</text>
					</view>
					<view>
						<uni-icons v-if="item.checked" type="checkmarkempty" size="20" color="#007aff"></uni-icons>
					</view>
				</view>
				<view class="na-build-box" v-if="house_data">
					<view class="na-build-body">
						<view v-if="(house_data.houses&&house_data.houses.length<=0)" style="padding: 20rpx 0;">无房屋信息！</view>
						<view class="na-build-line" v-for="(item,i) in house_data.houses" :key="item.floor_truth">
							<view class="loucen">{{item.floor_truth}}层</view>
							<view class="house_line">
								<text :class="{'on':child.checked}" @click.stop="clickFuncChooseHouse(child)" v-for="(child,j) in item.houses" :key="child.id">{{child.house_num}}#</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {USER_INFO} from "@/pages/framework/config/cache.js"
	import {
		// deleteJoinHouse,
		getHouseList,
		getZoneDetails,
		getCity,
		APIgetResidentialListHouse,
		APIgetBuildListHouse,
		APIgetUnitsListHouse,
		getRCHouseList,
		getHouse,
		putVoteHouseDA,
		postJoinHouse
	} from './service/api.js'
	export default {
		name: 'berHouse',
		props: ['biaojueid', 'zoneid'],
		data() {
			return {
				user_info: '',
				crumbs: [],
				list:[],
				vote_house:[],
				zone_details:'',
				house_data:'',
			}
		},
		watch: {
			zoneid: {
				handler(new_val) {
					if(new_val){
						this.getDetFn()
					}
				},
				immediate: true,
				deep: true
			},
			biaojueid: {
				handler(new_val) {
					if(new_val){
						this.getListFn()
					}
				},
				immediate: true,
				deep: true
			}
		},
		created() {
			//this.user_info = this.utils.getUser()
		},
		methods: {
			popFnOk(){
				if(this.list.length>0){
					for(let i in this.list){
						if(this.list?.[i]?.checked){
							let obj= {}
							if(this.list?.[i]?.type=='building'){
								obj.b = this.list?.[i]?.value
							}else if(this.list?.[i]?.type=='units'){
								obj.u = this.list?.[i]?.value
							}
							postJoinHouse(this.biaojueid,obj).then(res=>{
								uni.showToast({
									icon:'none',
									title:res.msg+''
								})
								setTimeout(()=>{
									this.getListFn()
									this.$refs.popup1.close()
								},1000)
							})
							return false
						}
					}
					return false
				}
				// ---------------------
				let on_house = []
				let off_house = []
				for(let i in this.house_data.houses){
					for(let j in this.house_data.houses[i].houses){
						if(this.house_data.houses[i].houses[j].checked&&JSON.stringify(this.vote_house).indexOf(this.house_data.houses[i].houses[j].id)<0){
							on_house.push(this.house_data.houses[i].houses[j].id)
						}
						if(!this.house_data.houses[i].houses[j].checked&&JSON.stringify(this.vote_house).indexOf(this.house_data.houses[i].houses[j].id)>=0){
							off_house.push(this.house_data.houses[i].houses[j].id)
						}
					}
				}
				
				putVoteHouseDA(this.biaojueid,{d:off_house,a:on_house}).then(res=>{
					uni.showToast({
						icon:'none',
						title:res.msg+''
					})
					setTimeout(()=>{
						this.getListFn()
						this.$refs.popup1.close()
					},1000)
				})
			},
			getListFn(){
				getHouseList(this.biaojueid).then(res=>{
					this.vote_house = res.data
				})
			},
			getDetFn(){
				getZoneDetails(this.zoneid).then(res=>{
					this.zone_details = res.data;
				})
			},
			// 选择房屋
			clickFuncChooseHouse(val){
				val.checked = !val.checked
			},
			refreshFn(){
				// this.getCodeName('500101001001')
				this.getCodeName(this.zoneid)
				// this.getCodeName(this.user_info?.region?.[0])
			},
			getCodeName(code){
				code = code+''
				let str = ''
				if(code.length<=6){
					str = code.substring(0,code.length-2)
				}else if(code.length<=9){
					str = code.substring(0,code.length-3)
				}else if(code.length<=12){
					str = code.substring(0,code.length-3)
				}
				if(code.length<=12){
					getCity(str).then(res=>{
						for(let i in res.data){
							if(code == res.data[i].code){
								let obj = {
									type:'region',
									next_type:'region',
									value:res.data?.[i]?.code,
									text:res.data?.[i]?.name,
								}
								if(res.data[i].code.length==12){
									obj.next_type = 'zone'
								}
								this.crumbs=[obj]
								this.getFnCode(obj)
								break
							}
						}
					})
					return false
				}
				getZoneDetails(code).then(res=>{
					this.zone_details = res.data;
					let obj = {
						type:'zone',
						next_type:'building',
						value:res.data.id,
						text:res.data.name,
					}
					this.crumbs=[obj]
					this.getFnCode(obj)
				})
			},
			// 小区或codeid
			// region
			// zone
			// building
			// units
			getFnCode(obj){
				this.list=[]
				this.house_data=''
				if(obj.next_type == 'region'){
					getCity(obj.value).then(res=>{
						let arr = []
						for(let i in res.data){
							arr.push({
								type:'region',
								next_type:res.data?.[i]?.code.length>12?'region':'zone',
								value:res.data?.[i]?.code,
								text:res.data?.[i]?.name,
								checked:false
							})
						}
						this.list = arr
					})
					return false
				}
				if(obj.next_type == 'zone'){
					APIgetResidentialListHouse({ page: 1, per_page: 500, china_code: obj.value }).then(res => {
					    // this.utFn(res.data.items,'zone','building')
						this.utFn(res.data,'zone','building')
					})
					return false
				}
				if(obj.next_type == 'building'){
					APIgetBuildListHouse({ page: 1, per_page: 500, zone_id: obj.value }).then(res => {
					    // this.utFn(res.data.items,'building','units')
						this.utFn(res.data,'building','units')
					})
					return false
				}
				if(obj.next_type == 'units'){
					APIgetUnitsListHouse({ page: 1, per_page: 500, building_id: obj.value }).then(res => {
					    // this.utFn(res.data.items,'units','house')
						this.utFn(res.data,'units','house')
					})
					return false
				}
				if(obj.next_type == 'house'){
					let data = {
						page: 1,
						per_page: 500,
						houseable_type: obj.type,
						houseable_id: obj.value
					}
					getHouse(data).then(res=>{
						for(let i in res.data.houses){
							for(let j in res.data.houses[i].houses){
								res.data.houses[i].houses[j].checked = false;
								for(let k in this.vote_house){
									if(this.vote_house[k] == res.data.houses[i].houses[j].id){
										res.data.houses[i].houses[j].checked = true;
										break
									}
								}
							}
						}
						this.house_data = res.data
					})
					return false
				}
			},
			utFn(item,str1,str2){
				let arr = []
				for(let i in item){
					arr.push({
						type:str1,
						next_type:str2,
						value:item?.[i]?.id,
						text:item?.[i]?.name,
						checked:false
					})
				}
				this.list = arr
			},
			clickFnCity(val){
				this.crumbs.push(val)
				this.getFnCode(val)
			},
			chooseFn(val){
				for(let i in this.list){
					if(this.list[i].value!=val.value){
						this.list[i].checked = false
					}
				}
				val.checked = !val.checked
			},
			crumbsFn(val){
				for(let i in this.crumbs){
					if(this.crumbs[i].value==val.value){
						this.crumbs = this.crumbs.slice(0,++i)
						break
					}
				}
				this.getFnCode(val)
			},
			popFnOpen(){
				this.refreshFn()
				this.$refs.popup1.open()
			},
			popFnClose(){
				this.$refs.popup1.close()
			},
			clickFuncDeleteHouse(){
				this.$emit('deleteFnHouse','')
			},
			
		}
	}
</script>
<style lang="scss" scoped>

</style>
