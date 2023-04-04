<template>
	<view>
		<headbar :title="'发布公示'"></headbar>
		<view>
			<view class="m-t-30">
			<uni-forms ref="form" :modelValue="formData" label-position="left" label-align="left" label-width="50" >
				<view class="na-title-sm p-lr-30">
					基础信息
				</view>
				<view class="bg-white p-30">
				<uni-forms-item label="公示主题"  label-width="auto" :errorMessage="err_obj['title']&&err_obj['title'][0]">
					<view class="border-b-grey p-10">
						<uni-easyinput v-model="formData.title" placeholder="请填写公示主题" :inputBorder="false" :clearSize="18"/>
					</view>
				</uni-forms-item>
				<uni-forms-item label="公示文号"  label-width="auto" :errorMessage="err_obj['proof']&&err_obj['proof'][0]">
					<view class="border-b-grey p-10">
						<uni-easyinput v-model="formData.proof" placeholder="请填写公示文号" :inputBorder="false" :clearSize="18"/>
					</view>
				</uni-forms-item>
				<uni-forms-item label="开始时间"  label-width="auto" :errorMessage="err_obj['start_at']&&err_obj['start_at'][0]">
					<view class="border-b-grey p-10">
						<!-- <picker class="na-input" mode="date" :value="formData.start_at" @change="val=>{formData.start_at = val.detail.value }">
							<view class="uni-input">{{formData.start_at||'请选择'}}</view>
						</picker> -->
						<uni-datetime-picker type="date" return-type="string" v-model="formData.start_at" :border="false"/>
					</view>
				</uni-forms-item>
				<uni-forms-item label="结束时间"  label-width="auto" :errorMessage="err_obj['end_at']&&err_obj['end_at'][0]">
					<view class="border-b-grey p-10">
						<!-- <picker class="na-input" mode="date" :value="formData.end_at" @change="val=>{formData.end_at = val.detail.value }">
							<view class="uni-input">{{formData.end_at||'请选择'}}</view>
						</picker> -->
						<uni-datetime-picker type="date" return-type="string" v-model="formData.end_at" :border="false"/>
					</view>
				</uni-forms-item>
				<uni-forms-item label="公示分类"  label-width="auto" :errorMessage="err_obj['cid']&&err_obj['cid'][0]">
					<view class="border-b-grey p-10">
						<uni-data-picker popup-title="请选择公示分类" :localdata="dataTree" v-model="formData.cid" >
						</uni-data-picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="阅读范围"  label-width="auto" :errorMessage="err_obj['toval']&&err_obj['toval'][0]">
					<view class="border-b-grey p-lr-20 p-tb-30">
						<ber-picker-region-zone :oldvalue="user_groups.region_val" @getCode="getValue"></ber-picker-region-zone>
					</view>
				</uni-forms-item>
				<!-- <uni-forms-item label="公示对象"  label-width="auto" :errorMessage="err_obj['toval']&&err_obj['toval'][0]">
					<view class="bg-white border-radius-base " style="padding: 4px 0;">
						<view style="min-height: 72rpx;display: flex;align-items: center;padding-left: 10rpx;" @click="clickFuncToval" >{{formData.toval&&formData.toval.text||'请选择'}}</view>
						<ber-picker-city ref="ber_picker_city" @getCitysValue="getCitysValue" :checkbox="true" :disables="[]" :level="99"></ber-picker-city>
					</view>
				</uni-forms-item> -->
				<!-- <uni-forms-item label="审核状态"  label-width="auto" :errorMessage="err_obj['status']&&err_obj['status'][0]">
					<view class="bg-white border-radius-base " style="padding: 4px 0;">
						<picker @change="val=>{formData.status = opts_all.status_all[val.detail.value].key }" mode='selector' :range="opts_all.status_all" range-key="val">
							<view style="min-height: 72rpx;display: flex;align-items: center;padding-left: 10rpx;">{{ getFuncOptVal(opts_all.status_all,formData.status) || '请选择'}}</view>
						</picker>
					</view>
				</uni-forms-item> -->
				<!-- <uni-forms-item label="接收单位"  label-width="auto" :errorMessage="err_obj['lv']&&err_obj['lv'][0]">
					<view class="bg-white border-radius-base " style="padding: 4px 0;">
						<picker @change="val=>{formData.lv = opts_all.article_lv[val.detail.value].key }" mode='selector' :range="opts_all.article_lv" range-key="val">
							<view style="min-height: 72rpx;display: flex;align-items: center;padding-left: 10rpx;">{{ getFuncOptVal(opts_all.article_lv,formData.lv) || '请选择'}}</view>
						</picker>
					</view>
				</uni-forms-item> -->
				</view>
				<view class="na-title-sm p-t-30 p-lr-30">
					公示内容
				</view>
				<view class="bg-white p-30">
					<ber-editor @inputFn="(val)=>{
						formData.content = val
					}" placeholder="请输入内容..." id="editor"></ber-editor>
				</view>
				<view class="na-title-sm p-t-30 p-lr-30">
					相关附件
					<view class="more">
						<view class="btn-size-xs btn-extra" @click="addFile">+ 添加附件</view>
					</view>
				</view>
				<view class="p-20 border-right-grey bg-white border-b-grey" style="position: relative;" v-for="(item,i) in formData.affix">
					<uni-forms-item label="选择文件" label-width="auto" :errorMessage="err_obj[`affix.${0}.file`]&&err_obj[`affix.${0}.file`][0]">
						<view @click="chooseFuncFile(i)" style="height: auto;word-break: break-word;padding-top:16rpx;">
							{{item.file||'选择文件'}}
						</view>
					</uni-forms-item>
					<uni-forms-item label="文件名称"  label-width="auto" :errorMessage="err_obj[`affix.${0}.title`]&&err_obj[`affix.${0}.title`][0]">
						<uni-easyinput v-model="item.title" placeholder="" :inputBorder="false" />
					</uni-forms-item>
					<uni-icons type="clear" size="26" color="#FF5A5F" style="position: absolute;right:6px;top: 0;" @click="delFuncFile(i)"></uni-icons>
				</view>
				<view class="na-title-sm p-t-30 p-lr-30">
					其它内容
					<view class="more">
						<view class="btn-size-xs btn-extra" @click="extraFnAdd">+ 添加内容</view>
					</view>
				</view>
				<uni-row class="bg-white flex-row border-b-grey" style="position: relative;" v-for="(item,i) in formData.custom" :key="i">
					<uni-col :span="8" class="border-r-grey">
						<uni-easyinput v-model="item.label" :inputBorder="false" autoHeight :maxlength="255" class="na-input" type="text" placeholder="字段名"/>
					</uni-col>
					<uni-col :span="16">
						<uni-easyinput v-model="item.val" :inputBorder="false" autoHeight :maxlength="255" class="na-input" type="text" placeholder="字段内容"/>
						<view style="position: absolute;right:6px; top:-6px;" @click="extraFnDel(i)">
							<uni-icons type="clear" size="26" color="#FF5A5F"></uni-icons>
						</view>
					</uni-col>
				</uni-row>
				<view class="na-main m-tb-30">
					<button type="primary" @click="submit">保 存</button>
				</view>
			</uni-forms>
			</view>
		</view>
		<view style="height: 40rpx;"></view>
	</view>
</template>

<script>
	// // 配置项
import { getOpts, getOptVal } from '@/pages/framework/utils/opts/opts.js'
import Cache from '@/pages/framework/utils/cache/cache.js'
import { USER_INFO,ZONE,GROUPS } from '@/pages/framework/config/cache.js'
import GetFilesKey from '@/pages/framework/utils/file/file.js'
import {ANNOUNCE} from '@/pages/framework/config/folder.js'
import {
	getTypeList,
	addAnnounce
} from './service/api.js'

export default {
	data() {
		return {
			opts_all:{},
			formData: {
				title:'',
				proof:'',
				start_at:'',
				end_at:'',
				cid:'',
				totype:'',
				toval:'',
				status:'',
				content:'',
				lv:'',
				affix:[],
				custom:[]
			},
			err_obj:{},
			user_info: '',
			range:[ ],
			zone:{},
			dataTree:[],
			user_groups:[]
		}
	},
	onLoad() {
		this.getCate();
		this.zone = this.utils.getUserZone()
		this.user_info = this.utils.getUser()
		this.user_groups = this.utils.getUserGroups()
	},
	methods: {
		//获取分类
		getCate(){
			let atemp=[]
			let opt = {
			    value: 101,
			    text: '公示',
			}
			atemp.push(
			    new Promise((resolve, reject) => {
			        getTypeList('announce').then(res => {
						opt.children = this.action(res.data)
			            return resolve(opt)
			        }).catch(err => {
			            resolve(opt)
			        })
			    })
			)
			Promise.all(atemp).then(res => {
			    this.dataTree = res
			})
		},
		//递归函数
		action(data){ 
			if(!data || data.length <= 0){ //递归出口
				return null;
			}
			return data.map(x => { //循环数据
			    const model = { //组装需要的键
					text: x.name,
					value: x.id,
				};
			    const children = this.action(x.children); //子级数据
			    if(children){ //一直往下循环查找有没有children这个键
				    model.children = children;
			    }			
				return model; //返回数据
			});
		},
		chooseFuncFile(i){
			uni.chooseImage({
				count:1,
				success:(res)=>{
					this.formData.affix[i].file = res.tempFilePaths[0]
				}
			})
		},
		delFuncFile(i){
			this.formData.affix.splice(i,1)
		},
		addFile(){
			this.formData.affix.unshift({title:'',file:''})
		},
		// clickFuncToval(){
		// 	let data = []
		// 	if(this.formData.toval){
		// 		data.push(this.formData.toval)
		// 	}
		// 	this.$refs.ber_picker_city.open(data)
		// },
		// getCitysValue(val){
		// 	if(val&&val.length>0){
		// 		this.formData.toval = val[0]
		// 		let new_val = val[0].value
		// 		let totype = '6'
		// 		// 3，区域 4：街道、5：社区, 6：小区
		// 		if (new_val.length <= 6) {
		// 		    totype = '3'
		// 		} else if (new_val.length <= 9) {
		// 		    totype = '4'
		// 		} else if (new_val.length <= 12) {
		// 		    totype = '5'
		// 		}
		// 		this.formData.totype = totype
		// 	}
		// },
		submit() {
			uni.showModal({
				title: '提示',
				content: '确定提交么？',
				success:  res => {
					if (res.confirm) {
						this.err_obj = {}
						let arr = []
						for(let i in this.formData.affix){
							arr.push(this.formData.affix[i].file)
						}
						let data = {...this.formData}
						data.start_at = data.start_at + " 00:00:00";
						data.end_at = data.end_at + " 23:59:59";
						data.groupid = this.user_groups.id
						data.groupcc = this.user_groups.region_val
						data.grouplv = this.user_groups.type
						
						console.log(data)
						if(arr.length<=0){
							addAnnounce(data).then(res=>{
								uni.showToast({
									icon: 'none',
									title: res.data.message,
									duration: 1000,
									mask:true
								})
								setTimeout(() => {
									let pages = getCurrentPages();  
									let prevPage = pages[ pages.length - 2 ]; 
									if(prevPage.$vm.downCallback){
										prevPage.$vm.downCallback();  
									}
									if(prevPage.$vm.getBackArticleId){
										prevPage.$vm.getBackArticleId(res.data.id);  
									}
									uni.navigateBack()
								}, 1000)
							}).catch(err=>{
								this.err_obj = err.data
							})
							return false
						}
						GetFilesKey(ANNOUNCE,arr).then(res=>{
							for(let i in res){
								data.affix[i].file = res[i]
							}
							addAnnounce(data).then(res=>{
								uni.showToast({
									icon: 'none',
									title: res.msg,
									duration: 1000,
									mask:true
								})
								setTimeout(() => {
									let pages = getCurrentPages();  
									let prevPage = pages[ pages.length - 2 ];  
									prevPage.$vm.downCallback();   
									uni.navigateBack()
								}, 1000)
							}).catch(err=>{
								this.err_obj = err.data
							})
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		getFuncOptVal(arr,key){
			return getOptVal(arr,key)
		},
		extraFnAdd(){
			this.formData.custom.push({
				label:'',
				type:'text',
				val:''
			})
		},
		extraFnDel(i){
			this.formData.custom.splice(i,1)
		},
		getValue(val){
			this.formData.toval = val.code;
			this.formData.totype = val.level;
			this.formData.lv = val.level;
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep .input-value-border{
	border-style: none;
}
</style>
