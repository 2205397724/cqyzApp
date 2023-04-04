<template>
	<uni-popup ref="popup" type="bottom" style="z-index: 500;" @change="changeFuncPopup">
		<view style="height: 70vh;width: 100%;background-color: #fff;border-radius: 12rpx 12rpx 0 0;box-sizing: border-box;">
			<uni-row style="padding: 20rpx ;font-size: 32rpx; box-sizing: border-box;">
				<uni-col :span="6" style="text-align: left;">
					<view @click="getCitysValue">确认</view>
				</uni-col>
				<uni-col :span="12" style="text-align: center;">
					<view >请选择区域</view>
				</uni-col>
				<uni-col :span="6" style="text-align: right;">
					<uni-icons type="close" size="26" @click="close"></uni-icons>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :span="5" >
					<view style="height: 72rpx;display: flex;justify-content: flex-end;align-items: center;">
						已选择：
					</view>
				</uni-col>
				<uni-col :span="19" >
					<scroll-view scroll-x="true" style="white-space: nowrap;" :scroll-into-view="scroll_into_view_y">
						<view :id="'scroll-into-view-y'+i" class="selected-city" v-for="(item,i) in active_arr" @click="deleteActiveFunc(i)">
							<view>{{item.text}}</view>
							<uni-icons type="close" size="20" style="margin: 4rpx;"></uni-icons>
						</view>
					</scroll-view>
				</uni-col>
			</uni-row>
			<scroll-view scroll-x="true" style="white-space: nowrap;" :scroll-into-view="scroll_into_view_x">
				<text :id="'scroll-into-view'+i" class="city" :class="{'city-on':i==active_class}" v-for="(item,i) in city_arr" :key="item.value" @click="clickCrumbs(i)">{{item.text}}</text>
			</scroll-view>
			<scroll-view scroll-y="true" style="height: calc(100% - 176rpx - 36rpx);">
				<view v-if="city_list.length<=0" style="width: 100%;text-align: center;padding: 20rpx 0;text-align: center;">
					已经到底了！
				</view>
				<view v-for="(item,i) in city_list" style="padding: 24rpx 30rpx;box-sizing: border-box;display: flex;align-items: center;justify-content: space-between;" @click="getListFunc(item)">
					<view style="display: flex;align-items: center;display: inline-flex;">
						<checkbox :disabled="item.disable" :value="JSON.stringify(item)" :checked="item.checked" style="transform:scale(0.7)" @click.stop="checkboxFunc(i,item.disable)"/>
						<text>{{item.name}}</text>
					</view>
					<view>
						<uni-icons v-if="item.checked" type="checkmarkempty" size="20" color="#007aff"></uni-icons>
					</view>
				</view>
			</scroll-view>
		</view>
	</uni-popup>							
</template>

<script>
	import {getCity} from './service/api.js'
export default {

    name: 'ber-picker-city',
    props: {
		checkbox: {
			type: Boolean,
			default: false
		},
		level: {
			type: Number,
			default: 2
		},
		disables:{
			type: Array,
			default: ()=> {return [0,1]}
		}
    },
    data() {
        return {
			active_arr:[],
			active_class:'',
			city_arr: [],
			city_list:[],
			scroll_into_view_x:'',
			scroll_into_view_y:''
        }
    },
	methods: {
		changeFuncPopup(obj){
			this.$emit('changeFuncPopup',obj)
		},
		getListFunc(item){
			// 如果有小区，在这里请求
			// if(item.next=='region'){
				this.getCityFunc({text:item.name,value:item.code})
			// }
		},
		deleteActiveFunc(i){
			this.active_arr.splice(i,1)
			this.rfreshCityList()
		},
		checkboxFunc(i,disable){
			if(disable){
				return false
			}
			if(this.checkbox){
				for(let j in this.city_list){
					if(i!=j){
						this.city_list[j].checked = false
					}
				}
			}
			this.city_list[i].checked = !this.city_list[i].checked
			if(this.city_list[i].checked){
				if(this.checkbox){
					this.active_arr = []
				}
				this.active_arr.unshift({text:this.city_list[i].name,value:this.city_list[i].code,type:this.city_list[i].type,next:this.city_list[i].next})
			}else{
				for(let j in this.active_arr){
					if(this.active_arr[j].value == this.city_list[i].code){
						this.active_arr.splice(j,1)
						break
					}
				}
			}
			
			this.scroll_into_view_y = ''
			setTimeout(()=>{
				this.scroll_into_view_y = 'scroll-into-view-y0'
			},200)
		},
		rfreshCityList(){
			for(let i in this.city_list){
				this.city_list[i].checked = false
				for(let j in  this.active_arr){
					if(this.city_list[i].code==this.active_arr[j].value){
						this.city_list[i].checked = true
						break
					}
				}
			}
		},
		clickCrumbs(i){
			this.active_class=i
			this.city_arr.splice(i+1,99)
			this.city_list = this.city_arr[i].children
			this.rfreshCityList()
		},
		getCityFunc(val){
			getCity(val.value).then(res=>{
				for(let i in res.data){
					res.data[i].type = 'region'
					res.data[i].next = 'region'
					res.data[i].disable = false
					if(val.value.length>=9&&val.value.length<12){
						res.data[i].next = 'zone'
					}
				}
				if(this.city_arr.length>this.level){
					res.data = []
				}
				if(this.disables.indexOf(this.city_arr.length)>=0){
					for(let i in res.data){
						res.data[i].disable = true
					}
				}
				val.children = res.data
				this.city_arr.push(val)
				this.active_class=this.city_arr.length-1
				this.city_list = res.data
				this.rfreshCityList()
				this.scroll_into_view_x = ''
				setTimeout(()=>{
					this.scroll_into_view_x = 'scroll-into-view'+this.active_class
				},200)
			})
		},
		open(val) {
			this.active_arr = val
			this.active_class = ''
			this.city_arr = []
			this.city_list = []
			this.getCityFunc({text:'全部',value:''})
			this.$refs.popup.open()
		},
		close(){
			this.$refs.popup.close()
		},
		getCitysValue(){
			console.log(this.active_arr)
			this.$emit('getCitysValue',this.active_arr)
			this.close()
		}
	},
}
</script>
<style lang="scss" scoped>
	.city{
		display: inline-block;
		margin: 0 10rpx;
		max-width: 180rpx;
		overflow: hidden;
		text-overflow: ellipsis; 
		white-space: nowrap;
		padding: 16rpx 10rpx;
	}
	.city-on{
		border-bottom: 4rpx solid #007aff;
		box-sizing: border-box;
	}
	.selected-city{
		display: inline-flex;
		margin: 4rpx 0 4rpx 12rpx;
		padding:0 10rpx 0 18rpx;
		color: rgb(144, 147, 153);
		background-color: rgb(240, 242, 245);
		font-size: 24rpx;
		align-items: center;
	}
</style>
