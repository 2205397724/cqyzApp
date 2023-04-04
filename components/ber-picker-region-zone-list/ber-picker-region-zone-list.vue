<template>
	<view class="inline-block">
		<view class="na-search" @click="popFuncOpen">
			<view class="na-search-item " :class="{'active':now_code.name}">
				<view class="item">
					<text class="font-grey size-sm" :class="{'font-primary':now_code.name}">{{now_code.name || '按区域'}}</text>
					<image class="image"></image>
				</view>
			</view>
		</view>
		<uni-popup ref="popup1" type="bottom"  @maskClick="popFnClose">
			<view class="flex-row flex-between m-b-20">
				<view style="white-space: nowrap;" @click="popFnChoose(true)">确定</view>
				<view class="ellipsis m-lr-40 size-lg font-grey">{{now_code.name}}</view>
				<view style="white-space: nowrap;" @click="popFnClose">取消</view>
			</view>
			<scroll-view scroll-x="true" style="white-space: nowrap;min-height: 76rpx;">
				<text @click.stop="crumbsFunc(item)"  style="display: inline-block;margin: 0 10rpx;padding: 16rpx 10rpx;font-size: 28rpx;color: #333333;" v-for="(item,i) in crumbs">{{item.name}}</text>
			</scroll-view>
			<scroll-view scroll-y="true" style="height: 54vh;">
				<view v-if="list.length<=0" style="width: 100%;text-align: center;padding: 20rpx 0;text-align: center;">
					~空空如也~
				</view>
				<view v-else v-for="(item,i) in list" @click.stop="clickFnCity(item)" style="padding: 24rpx 30rpx;box-sizing: border-box;display: flex;align-items: center;justify-content: space-between;">
					<view style="display: flex;align-items: center;display: inline-flex;">
						<checkbox :value="JSON.stringify(item)" :checked="item.checked" style="transform:scale(0.7)" @click.stop="chooseFunc(item)"/>
						<text>{{item.name}}</text>
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
		getList
	} from './service/api.js'
	export default {
		name: 'berPickerRegionZone',
		props: ['oldvalue'],
		watch: {
			oldvalue: {
				handler(new_val) {
					this.getFnDetails(new_val+'')
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
				this.now_code = this.active_code
				this.$refs.popup1.close()
			},
			// 面包屑
			crumbsFunc(val){
				this.now_code = ''
				for(let i in this.crumbs){
					if(this.crumbs[i].code==val.code){
						this.crumbs = this.crumbs.slice(0,++i)
						break
					}
				}
				if(val.level==5){
					this.getZoneList(val.code)
					return false
				}
				this.getList(val.code)
			},
			// 选择
			chooseFunc(val){
				for(let i in this.list){
					if(this.list[i].code!=val.code){
						this.list[i].checked = false
					}
				}
				val.checked = !val.checked
				this.now_code = ''
				if(val.checked){
					this.now_code = val
				}
			},
			// 点击城市
			clickFnCity(val){
				this.now_code = ''
				this.crumbs.push(val)
				if(!val.code||(val.level<5&&val.code.length<12)){
					this.getList(val.code)
				}else if(val.level==5&&val.code.length==12){
					this.getZoneList(val.code)
				}else{
					this.list=[]
				}
			},
			// 获取小区
			getZoneList(id){
				getList({ 
					page:1,
					per_page:500,
					china_code: id
				}).then(res=>{
					let arr = []
					// for(let i in res.data.items){
					// 	arr.push({
					// 		checked:false,
					// 		name:res.data.items[i].name,
					// 		code:res.data.items[i].id,
					// 		level:6
					// 	})
					// }
					for(let i in res.data){
						arr.push({
							checked:false,
							name:res.data[i].name,
							code:res.data[i].id,
							level:6
						})
					}
					this.list=arr
				})
			},
			// 获取完整的信息 如果列表里面没有匹配的code 会报错的 
			getFnDetails(code){
				if(!code){
					this.now_code = {
						code:'',
						name:'全部'
					}
					this.old_code = {
						code:'',
						name:'全部'
					}
					this.crumbs = [{
						code:'',
						name:'全部'
					}]
					this.active_code = [{
						code:'',
						name:'全部'
					}]
					this.getList()
					return false
				}
				let str = ''
				switch(code.length) {
				     case 6:
				        str = code.substring(0,code.length-2)
				        break;
				     case 9:
				        str = code.substring(0,code.length-3)
				        break;
					 case 12:
					    str = code.substring(0,code.length-3)
					    break;
				} 
				getCity(str).then(res=>{
					for(let i in res.data){
						if(code == res.data[i].code){
							this.now_code = JSON.parse(JSON.stringify(res.data[i]))
							this.old_code = JSON.parse(JSON.stringify(res.data[i]))
							this.crumbs = [JSON.parse(JSON.stringify(res.data[i]))]
							this.active_code =JSON.parse(JSON.stringify(res.data[i]))
							this.popFnChoose()
							break
						}
					}
					this.getList(this.oldvalue)
				})
			},
			// 获取列表
			getList(code){
				getCity(code).then(res=>{
					for(let i in res.data){
						res.data[i].checked = false
					}
					this.list=res.data
				})
			},
			popFuncOpen(){
				this.$refs.popup1.open()
			},
			popFnChoose(val) {
				if(!this.now_code.name){
					this.now_code = this.old_code
				}
				if(this.now_code.level<4){
					this.now_code.level = 3
				}
				if(val){
					this.$emit('getCode', this.now_code)
				}
				this.active_code = this.now_code
				this.$refs.popup1.close()
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
