<template>
	<view>
		<headbar @clickLeft='clickLeft'></headbar>
		<view class="na-main p-b-40 p-t-40">
			<!-- <view class="na-title">
				<view class="text" >事件</view>
				<view class="more" style="color: #00b7bd;display: flex;align-items: center;font-size: 26rpx;"> </view>
			</view> -->
			<view class="m-b-40">
				<view class="font-grey size-lg m-b-20">事件名称和时间</view>
				<view v-if="!biaojueid">
					<button type="primary" style="margin-bottom: 20rpx;" @click="()=>{
						formData={
							type:'',
							status:'',
							opttype:99
						};
						clickFuncTimeNameOpen();
					}">创建事件</button>
				</view>
				<view v-else class="na-card bg-white p-30"  @click="clickFuncTimeNameOpen">
					<view class="font-grey flex-row m-b-10">
						<view style="white-space: nowrap;">事件名称：</view>
						<view style="color: #000; line-height: 1.1rem;"> {{ vote_details.name }}</view>
					</view>
					<view class="font-grey flex-row m-b-10">
						<view style="white-space: nowrap;">开始时间：</view>
						<view style="color: #000; line-height: 1.1rem;"> {{vote_details.startat}}</view>
					</view>
					<view class="font-grey flex-row m-b-10">
						<view style="white-space: nowrap;">结束时间：</view>
						<view style="color: #000; line-height: 1.1rem;"> {{vote_details.endat}}</view>
					</view>
					<view class="font-grey flex-row m-b-10">
						<view style="white-space: nowrap;">参与类型：</view>
						<view style="color: #000; line-height: 1.1rem;"> {{ getFuncOptVal(opts_all.vote_type,vote_details.opttype) }}</view>
					</view>
					<view class="font-grey flex-row ">
						<view style="white-space: nowrap;">最多选择数目：</view>
						<view style="color: #000; line-height: 1.1rem;"> {{vote_details.vmax}}</view>
					</view>
					<view class="font-grey flex-row ">
						<view style="white-space: nowrap;">内容：</view>
						<view style="color: #000; line-height: 1.1rem;"> 
							<jyf-parser :html="vote_details.content" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">
																加载中...</jyf-parser>
						</view>
					</view>
				</view>
			</view>
			<view class="m-b-40" v-if="biaojueid">
				<view class="font-grey size-lg m-b-20">分摊详情</view>
				<ber-house :biaojueid='biaojueid' @deleteFnHouse="clickFuncDeleteHouse" :zoneid='vote_details.zid'></ber-house>
				<!-- <uni-swipe-action>
					<uni-swipe-action-item class="m-b-20 ">
						<view class="na-card bg-white p-30 flex-row flex-center font-primary size-lg" @click="clickFuncToHouse">
							<span >{{zone.name}} {{vote_house.length}}套</span>
						</view>
						<template v-slot:right>
							<view @click="clickFuncDeleteHouse" style="padding: 0 40rpx; background-color: #dd524d;color:#ffffff;display: flex;align-items: center;" class="bg-red" >删除所有</view>
						</template>
					</uni-swipe-action-item>
				</uni-swipe-action> -->
				
				<view class="na-card bg-white p-30"  @click="clickFuncTimeNameOpen">
					<view class="font-grey flex-row m-b-10">
						<view style="white-space: nowrap;">权票数：</view>
						<view style="color: #000; line-height: 1.1rem;">{{formData.ticketall}} </view>
					</view>
					<view class="font-grey flex-row ">
						<view style="white-space: nowrap;">总面积：</view>
						<view style="color: #000; line-height: 1.1rem;">{{formData.areaall}} </view>
					</view>
				</view>
			</view>
			<view class="m-b-40" v-if="biaojueid">
				<view class="font-grey size-lg m-b-20">选项</view>
				<view>
					<uni-swipe-action>
						<uni-swipe-action-item class="m-b-20 " v-for="(item,i) in vote_opt" :key="item.val">
							<view class="na-card bg-white p-30 size-lg"  @click="clickFuncXuanXiangDefails(item.id)">
								{{item.name}}
							</view>
							<template v-slot:right>
								<view @click="clickFuncDeleteOpts(item.id)" style="padding: 0 40rpx; background-color: #dd524d;color:#ffffff;display: flex;align-items: center;" class="bg-red" >删除</view>
							</template>
						</uni-swipe-action-item>
					</uni-swipe-action>
					<view class="na-card bg-white p-30 flex-row flex-center font-primary m-b-20 size-lg" @click="()=>{
						opt_add = true;
						clickFuncXuanXiangOpen();
					}">
						＋ 添加选项
					</view>
				</view>
			</view>
			<!-- <view>
				<button type="primary" style="margin-bottom: 20rpx;" >保存</button>
			</view> -->
		</view>
		<uni-popup ref="nametime" type="bottom">
			<scroll-view scroll-y="true" style="max-height: 70vh;">
				<uni-forms ref="baseForm" :modelValue="formData">
					<uni-forms-item label="事件名称" labelWidth="60px" :errorMessage="formDataError&&formDataError['name']?formDataError['name'][0]:''">
						<uni-easyinput v-model="formData.name" placeholder="" />
					</uni-forms-item>
					<uni-forms-item label="开始时间" labelWidth="60px" :errorMessage="formDataError&&formDataError['startat']?formDataError['startat'][0]:''">
						<uni-datetime-picker type="datetime" return-type="string" v-model="formData.startat"/>
					</uni-forms-item>
					<uni-forms-item label="结束时间" labelWidth="60px" :errorMessage="formDataError&&formDataError['endat']?formDataError['endat'][0]:''">
						<uni-datetime-picker type="datetime" return-type="string" v-model="formData.endat"/>
					</uni-forms-item>
					<uni-forms-item label="投几项" labelWidth="60px" :errorMessage="formDataError&&formDataError['vmax']?formDataError['vmax'][0]:''">
						<uni-easyinput v-model="formData.vmax" placeholder="'0'表示全部要投" />
					</uni-forms-item>
					<uni-forms-item label="总票数" labelWidth="60px"  :errorMessage="formDataError&&formDataError['ticketall']?formDataError['ticketall'][0]:''">
						<uni-easyinput v-model="formData.ticketall" placeholder="" />
					</uni-forms-item>
					<uni-forms-item label="总面积数" labelWidth="60px"  :errorMessage="formDataError&&formDataError['areaall']?formDataError['areaall'][0]:''">
						<uni-easyinput v-model="formData.areaall" placeholder="" />
					</uni-forms-item>
					<uni-forms-item label="参与类型" labelWidth="60px" :errorMessage="formDataError&&formDataError['opttype']?formDataError['opttype'][0]:''">
						<view style="height: 100%;width: 100%;display: flex;align-items: center;border-radius: 4px;border: 1px solid #e5e5e5;box-sizing: border-box;padding: 0 20rpx;">
							<picker @change="val=>{formData.opttype = opts_all.vote_type[val.detail.value].key }" mode='selector' :range="opts_all.vote_type" range-key="val">
								<view >{{ getFuncOptVal(opts_all.vote_type,formData.opttype) || '请选择'}}</view>
							</picker>
						</view>
					</uni-forms-item>
					<uni-forms-item label="内容" labelWidth="60px" :errorMessage="formDataError&&formDataError['content']?formDataError['content'][0]:''">
						<!-- <uni-easyinput v-model="formData.content" autoHeight :maxlength="-1" type="textarea" placeholder="请输入..." /> -->
						<ber-editor @inputFn="(val)=>{
							formData.content = val
						}" placeholder="请输入内容..." id="editor"></ber-editor>
					</uni-forms-item>
				</uni-forms>
				<view>
					<button type="primary" style="margin-bottom: 20rpx;" @click="clickFuncTimeNameClose">保存</button>
				</view>
			</scroll-view>
		</uni-popup>
		<uni-popup ref="xuanxiang" type="bottom">
			<scroll-view scroll-y="true" style="max-height: 70vh;">
				<uni-forms ref="baseForm" :modelValue="vote_data">
					<uni-forms-item label="选项名称" labelWidth="60px"  :errorMessage="vote_data_err&&vote_data_err['name']?vote_data_err['name'][0]:''" >
						<uni-easyinput v-model="vote_data.name" placeholder="" />
					</uni-forms-item>
					<uni-forms-item label="选项值" labelWidth="60px"  :errorMessage="vote_data_err&&vote_data_err['val']?vote_data_err['val'][0]:''">
						<uni-easyinput v-model="vote_data.val" placeholder="" />
					</uni-forms-item>
					<uni-forms-item label="排序" labelWidth="60px"  :errorMessage="vote_data_err&&vote_data_err['sort']?vote_data_err['sort'][0]:''">
						<uni-easyinput v-model="vote_data.sort" placeholder="" />
					</uni-forms-item>
					<uni-forms-item label="备注" labelWidth="60px"  :errorMessage="vote_data_err&&vote_data_err['extra.desc']?vote_data_err['extra.desc'][0]:''">
						<!-- <uni-easyinput v-model="vote_data.extra.desc" autoHeight :maxlength="-1" type="textarea" placeholder="请输入..." /> -->
						<ber-editor @inputFn="(val)=>{
							vote_data.extra.desc = val
						}" placeholder="请输入..." id="editor"></ber-editor>
					</uni-forms-item>
				</uni-forms>
				<view style="margin-bottom: 20rpx;">
					<button type="primary"  @click="clickFuncXuanXiangClose()">保存</button>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	
	import Cache from "@/pages/framework/utils/cache/cache.js"
	import {ZONE} from "@/pages/framework/config/cache.js"
	 // 配置项
	import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
	import {
		postVote,
		getVoteDetails,
		putVote,
		deleteJoinHouse,
		postJoinHouse,
		getHouseList,
		getVoteOptList,
		postVoteOpt,
		putVoteOpt,
		getVoteOptDetails,
		deleteOpts,
		putVoteHouseDA
	} from './service/api.js'
	export default {
		data() {
			return {
				biaojueid:'',
				opts_all:{},
				zone: '',
				house:{},
				vote_details:{
					name:'',
					startat:'',
					endat:'',
					vmax:'',
					ticketall:'',
					areaall:'',
					opttype:'',
					content:'',
				},
				formData:{
					name:'',
					startat:'',
					endat:'',
					vmax:'',
					ticketall:'',
					areaall:'',
					opttype:'',
					content:'',
				},
				formDataError:{},
				vote_data:{
					name:'',
					val:'',
					sort:'',
					extra:{}
				},
				vote_data_err:{},
				opt_add:true,
				vote_opt:[],
				vote_house:[]
			}
		},
		onLoad(opts) {
			if(opts.opt){
				this.biaojueid = JSON.parse(decodeURIComponent(opts.opt))
				this.getFuncVoteDetails()
				this.getFuncHouseList()
				this.getFuncOptList()
			}
			getOpts(['vote_status','vote_type','vote_or_biaojue']).then(res => {
			    this.opts_all = res
			})
			this.zone = this.utils.getUserZone()
		},
		onReady() {
			// #ifdef APP-PLUS
			plus.navigator.setStatusBarStyle('dark')
			// #endif
		},
		methods: {
			clickLeft(){
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				if(prevPage.$vm.deleteVote){
					prevPage.$vm.deleteVote();
				}
			},
			getFuncVoteDetails(){
				getVoteDetails(this.biaojueid).then(res=>{
					this.formData = {
						id:res.data.id,
						type:res.data.type,
						zid:res.data.zid,
						name:res.data.name,
						startat:res.data.startat,
						endat:res.data.endat,
						content:res.data.content,
						vmax:res.data.vmax,
						ticketall:res.data.ticketall,
						areaall:res.data.areaall,
						status: this.getOptObj(this.opts_all.vote_status,res.data.status) ,
						opttype:res.data.opttype,
					}
					this.vote_details = {...res.data}
				})
			},
			clickFuncXuanXiangClose(){
				this.vote_data_err = {}
				if(this.opt_add){
					postVoteOpt(this.vote_data).then(res=>{
						this.getFuncOptList()
						this.$refs.xuanxiang.close()
					}).catch(err=>{
						this.vote_data_err = err.data
					})
				}else{
					putVoteOpt(this.vote_data.id,this.vote_data).then(res=>{
						this.getFuncOptList()
						this.$refs.xuanxiang.close()
					}).catch(err=>{
						this.vote_data_err = err.data
					})
				}
			},
			clickFuncXuanXiangOpen(){
				this.vote_data_err = {}
				this.vote_data = {
					vid: this.biaojueid,
					name:'',
					val:'',
					sort:'',
					extra:{}
				}
				this.$refs.xuanxiang.open()
			},
			getFuncOptList(){
				getVoteOptList({vid:this.biaojueid}).then(res=>{
					this.vote_opt = res.data
				})
			},
			clickFuncXuanXiangDefails(id){
				this.opt_add = false;
				this.vote_data_err = {}
				getVoteOptDetails(id).then(res=>{
					this.vote_data = res.data
					if(!this.vote_data.extra){
						this.vote_data.extra = {desc:''}
					}
					this.$refs.xuanxiang.open()
				})
			},
			clickFuncTimeNameClose(){
				this.formDataError = {}
				if(this.biaojueid){
					let data = {
						type:this.formData.type,
						zid:this.zone.id,
						name:this.formData.name,
						startat:this.formData.startat,
						endat:this.formData.endat,
						content:this.formData.content,
						vmax:this.formData.vmax,
						ticketall:this.formData.ticketall,
						areaall:this.formData.areaall,
						status:this.opts_all.vote_status[0]?.key || 1,
						opttype:this.formData.opttype,
					}
					putVote(this.formData.id,data).then(res=>{
						this.getFuncVoteDetails()
						this.$refs.nametime.close()
					}).catch(err=>{
						this.formDataError = err.data
					})
				}else{
					let data = {
						type:this.opts_all.vote_or_biaojue[1]?.key || 2,
						zid:this.zone.id,
						name:this.formData.name,
						startat:this.formData.startat,
						endat:this.formData.endat,
						content:this.formData.content,
						vmax:this.formData.vmax,
						ticketall:this.formData.ticketall,
						areaall:this.formData.areaall,
						status:this.opts_all.vote_status[0]?.key || 1,
						opttype:this.formData.opttype,
					}
					postVote(data).then(res=>{
						this.biaojueid = res.data.id
						this.getFuncVoteDetails()
						this.getFuncHouseList()
						this.getFuncOptList()
						this.$refs.nametime.close()
					}).catch(err=>{
						this.formDataError = err.data
					})
				}
			},
			clickFuncTimeNameOpen(){
				this.formDataError = {}
				this.$refs.nametime.open()
			},
			getFuncHouseList(){
				getHouseList(this.biaojueid).then(res=>{
					this.vote_house = res.data
				})
			},
			// 选择房屋返回的值
			getBackData(val){
				console.log(val)
				this.house = val
				let data = {}
				if(val.h){
					data = {
						a:[],
						d:[]
					}
					for(let i in val.h.a){
						data.a.push(val.h.a[i].id)
					}
					for(let i in val.h.d){
						data.d.push(val.h.d[i].id)
					}
					putVoteHouseDA(this.biaojueid,data).then(res=>{
						this.getFuncHouseList()
					})
					return false
				}else if(val.u){
					data.u = val.u.id
				}else{
					data.b = val.b.id
				}
				postJoinHouse(this.biaojueid,data).then(res=>{
					this.getFuncHouseList()
				})
			},
			clickFuncDeleteOpts(id){
				uni.showModal({
					title: '提示',
					content: '确定删除当前选项么？',
					success:  (res) => {
						if (res.confirm) {
							deleteOpts(id).then(res=>{
								this.getFuncOptList()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			clickFuncDeleteHouse(){
				uni.showModal({
					title: '提示',
					content: '确定删除该事项所有参与房屋么？',
					success:  (res) => {
						if (res.confirm) {
							deleteJoinHouse(this.biaojueid).then(res=>{
								this.getFuncHouseList()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			clickFuncToHouse(){
				this.utils.route(`/pages/survey/vote_house/vote_house?opt=${encodeURIComponent(JSON.stringify(this.biaojueid))}`)
			},
			getOptIndex(arr,key){
				for(let i in arr){
					if(key == arr[i].key){
						return i
					}
				}
				return ''
			},
			getOptObj(arr,key){
				for(let i in arr){
					if(key == arr[i].key){
						return arr[i]
					}
				}
				return ''
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>

<style>

</style>
