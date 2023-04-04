<template>
	<view style="background-color: #ffffff;min-height: 100%;">
		<headbar :border="true"></headbar>
		<view class="na-main p-b-40 p-t-40">
			<uni-forms ref="baseForm" :modelValue="formData" label-position="top" label-align="left">
				<uni-forms-item label="事件名称" labelWidth="60px" :errorMessage="formDataError&&formDataError['name']?formDataError['name'][0]:''">
					<uni-easyinput v-model="formData.name" placeholder="" />
				</uni-forms-item>
				<uni-forms-item label="开始时间" labelWidth="60px" :errorMessage="formDataError&&formDataError['startat']?formDataError['startat'][0]:''">
					<uni-datetime-picker type="datetime" return-type="string" v-model="formData.startat"/>
				</uni-forms-item>
				<uni-forms-item label="结束时间" labelWidth="60px" :errorMessage="formDataError&&formDataError['endat']?formDataError['endat'][0]:''">
					<uni-datetime-picker type="datetime" return-type="string" v-model="formData.endat"/>
				</uni-forms-item>
				<uni-forms-item label="参与类型" labelWidth="60px" :errorMessage="formDataError&&formDataError['type']?formDataError['type'][0]:''">
					<view style="min-height: 82rpx;height: 100%;width: 100%;display: flex;align-items: center;border-radius: 4px;border: 1px solid #e5e5e5;box-sizing: border-box;padding: 0 20rpx;">
						<picker @change="val=>{formData.type = opts_all.user_wuye[val.detail.value].key }" mode='selector' :range="opts_all.user_wuye" range-key="val">
							<view >{{ getFuncOptVal(opts_all.user_wuye,formData.type) || '请选择'}}</view>
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="内容" labelWidth="60px" :errorMessage="formDataError&&formDataError['content']?formDataError['content'][0]:''">
					<!-- <uni-easyinput v-model="formData.content" autoHeight :maxlength="-1" type="textarea" placeholder="请输入..." /> -->
					<ber-editor @inputFn="(val)=>{
						formData.content = val
					}" placeholder="请输入..." id="editor"></ber-editor>
				</uni-forms-item>
			</uni-forms>
			<view>
				<button type="primary" style="margin-bottom: 20rpx;" @click="clickFuncTimeNameClose">保存</button>
			</view>
		</view>
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
		putVote
	} from './service/api.js'
	export default {
		data() {
			return {
				biaojueid:'',
				opts_all:{},
				zone: '',
				formData:{
					name:'',
					startat:'',
					endat:'',
					type:'',
					content:'',
				},
				formDataError:{},
			}
		},
		onLoad(opts) {
			if(opts.opt){
				this.biaojueid = JSON.parse(decodeURIComponent(opts.opt))
				this.getFuncVoteDetails()
			}
			getOpts(['vote_status','user_wuye']).then(res => {
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
			// 获取详情
			getFuncVoteDetails(){
				getVoteDetails(this.biaojueid).then(res=>{
					this.formData = {
						type:res.data.type,
						zid:res.data.zid,
						name:res.data.name,
						startat:res.data.startat,
						endat:res.data.endat,
						content:res.data.content,
						status:res.data.status,
					}
				})
			},
			backFuncGoBack(res){
				uni.showToast({
					icon:'none',
					title:res.msg
				})
				setTimeout(()=>{
					let pages = getCurrentPages();  //获取所有页面栈实例列表
					let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					prevPage.$vm.backFuncRefreshEntry();   //修改上一页data里面的searchVal参数值为1211
					if(prevPage.$vm.deleteVote2){
						prevPage.$vm.deleteVote2()
					}
					uni.navigateBack()
				},1000)
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
						status:this.opts_all.vote_status[0]?.key || 1,
					}
					putVote(this.biaojueid,data).then(res=>{
						 this.backFuncGoBack(res)
					}).catch(err=>{
						this.formDataError = err.data
					})
				}else{
					let data = {
						type:this.formData.type,
						zid:this.zone.id,
						name:this.formData.name,
						startat:this.formData.startat,
						endat:this.formData.endat,
						content:this.formData.content,
						status:this.opts_all.vote_status[0]?.key || 1,
					}
					postVote(data).then(res=>{
						 this.backFuncGoBack(res)
					}).catch(err=>{
						this.formDataError = err.data
					})
				}
			},
			getFuncOptVal(arr,key){
				return getOptVal(arr,key)
			},
		}
	}
</script>

<style>

</style>
