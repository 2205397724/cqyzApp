<template>
	<view class="inline-block">
		<view class="na-search" @click="popFuncOpen">
			{{now_code.name}}
		</view>
		<uni-popup ref="popup1" type="bottom" >
			<view class="flex-row flex-between m-b-20">
				<view class="btn-size-sm btn-primary" style="white-space: nowrap;" @click="popFnChoose">确定</view>
				<view class="ellipsis m-lr-40 size-lg font-grey">{{now_code.name}}</view>
				<view style="white-space: nowrap;" @click="popFnClose">取消</view>
			</view>
			<scroll-view scroll-x="true" style="white-space: nowrap;min-height: 76rpx;border-bottom: 1px solid #efefef;">
				<text @click.stop="crumbsFunc(item)"  style="display: inline-block;margin-right:20rpx;padding:20rpx 0rpx;font-size: 28rpx;color: #333333;" v-for="(item,i) in crumbs">{{item.name}}</text>
			</scroll-view>
			<scroll-view scroll-y="true" style="height: 54vh;">
				<view v-if="list.length<=0" class="font-grey size-base p-tb-40 align-center">
					~没有更多内容~
				</view>
				<view v-else v-for="(item,i) in list" @click.stop="clickFnCity(item)" class="flex-row flex-between flex-center p-tb-20">
					<view style="display: flex;align-items: center;display: inline-flex;">
						<checkbox :value="JSON.stringify(item)" :checked="item.checked" style="transform:scale(0.7)" @click.stop="chooseFunc(item)"/>
						<text class="size-base">{{item.name}}</text>
					</view>
					<view>
						<uni-icons v-if="item.checked" type="checkmarkempty" size="20" color="#007aff"></uni-icons>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCity,
		getZonesList
	} from './service/api.js'
	import Cache from '@/pages/framework/utils/cache/cache.js'
	import {GROUPS} from '@/pages/framework/config/cache.js'
	export default {
		name: 'berPickerRegionZone',
		props: ['oldvalue'],
		watch: {
			oldvalue: {
				handler(new_val) {
					let groups = Cache.get(GROUPS)
					this.now_code = {
						name: groups.region_cc_name,
						code: groups.region_val,
						level: groups.type,
					}
				},
				immediate: true,
				deep: true
			},
		},
		data() {
			return {
				now_code: '',
				crumbs:[],
				list:[],
				old_code:'',
				active_code:''
			}
		},
		methods: {
			// 取消
			popFnClose(){
				this.$refs.popup1.close()
			},
			// 面包屑
			crumbsFunc(val){
				for(let i in this.crumbs){
					if(this.crumbs[i].code==val.code){
						this.crumbs = this.crumbs.slice(0,++i)
						break
					}
				}
				this.now_code = val
				// if(val.level==5){
				// 	this.getZoneList(val.code)
				// 	return false
				// }
				this.getCityList(val.code)
			},
			// 选择
			chooseFunc(val){
				for(let i in this.list){
					if(this.list[i].code!=val.code){
						this.list[i].checked = false
					}
				}
				val.checked = !val.checked
				this.now_code = val
				// if(val.checked){
				// 	this.now_code = val
				// }
			},
			// 点击城市
			clickFnCity(val){
				this.now_code = val
				this.crumbs.push(val)
				//给选中的数组去重复。
				let obj = {};
				this.crumbs = this.crumbs.reduce((newArr, next) => {
					obj[next.code] ? "" : (obj[next.code] = true && newArr.push(next));
					return newArr;
				}, []);
				
				this.getCityList(val.code)
				// if(!val.code||(val.level<5&&val.code.length<12)){
				// 	this.getCityList(val.code)
				// }else if(val.level==5&&val.code.length==12){
				// 	this.getZoneList(val.code)
				// }else{
				// 	this.list=[]
				// }
			},
			// 获取小区
			getZoneList(id){
				getZonesList({ 
					page:1,
					per_page:500,
					china_code: id
				}).then(res=>{
					let arr = []
					for(let i in res.data){
						arr.push({
							checked:false,
							name:res.data[i].name,
							code:res.data[i].id,
							china_code:res.data[i].china_code,
							level:6
						})
					}
					this.list=arr
				})
			},
			// 获取完整的信息 如果列表里面没有匹配的code 会报错的 
			getFnDetails(code){
				// if(!code){
				// 	this.now_code = {
				// 		code:'',
				// 		name:'全部'
				// 	}
				// 	this.old_code = {
				// 		code:'',
				// 		name:'全部'
				// 	}
				// 	this.crumbs = [{
				// 		code:'',
				// 		name:'全部'
				// 	}]
				// 	this.active_code = [{
				// 		code:'',
				// 		name:'全部'
				// 	}]
				// 	this.getCityList()
				// 	return false
				// }
				// let str = ''
				// switch(code.length) {
				//      case 6:
				//         str = code.substring(0,code.length-2)
				//         break;
				//      case 9:
				//         str = code.substring(0,code.length-3)
				//         break;
				// 	 case 12:
				// 	    str = code.substring(0,code.length-3)
				// 	    break;
				// } 
				// getCity(str).then(res=>{
				
				// 	for(let i in res.data){
				// 		if(code == res.data[i].code){
				// 			this.now_code = JSON.parse(JSON.stringify(res.data[i]))
				// 			this.old_code = JSON.parse(JSON.stringify(res.data[i]))
				// 			this.crumbs = [JSON.parse(JSON.stringify(res.data[i]))]
				// 			this.active_code =JSON.parse(JSON.stringify(res.data[i]))
				// 			break
				// 		}
				// 	}
				// 	this.getCityList(this.oldvalue)
				// })
			},
			// 获取列表
			getCityList(code){
				getCity(code).then(res=>{
					if(res.data.length==0){
						this.getZoneList(code)
					}else{
						for(let i in res.data){
							res.data[i].checked = false
						}
						this.list=res.data
					}
				})
			},
			popFuncOpen(){
				let arr = []
					arr.push({
						checked:true,
						name: this.now_code.name,
						code: this.now_code.code,
						level: this.now_code.level
					})
				this.list = arr
				this.active_code = arr
				this.$refs.popup1.open()
			},
			popFnChoose() {
				if(!this.now_code.name){
					this.now_code = this.old_code
				}
				if(this.now_code.level<4){
					this.now_code.level = 3
				}
				this.$emit('getCode', this.now_code)
				this.active_code = this.now_code
				this.$refs.popup1.close()
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
