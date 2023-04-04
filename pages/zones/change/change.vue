<template>
	<view>
		<headbar fixed="true" title="发起联名活动"></headbar>
		<view>
			<view>
				<uni-forms ref="form" :modelValue="formData" label-position="left" label-align="left" label-width="50">
					<view class="bg-white p-30">
						<uni-forms-item label="活动主题" label-width="auto">
							<view class="border-b-grey p-10">
								<uni-easyinput v-model="formData.name" placeholder="" :inputBorder="false" />
							</view>
						</uni-forms-item>
						<uni-forms-item label="起始时间" label-width="auto">
							<view class="border-b-grey p-10">
								<uni-datetime-picker type="datetime" return-type="string" v-model="formData.startat"
									:border="false" />
							</view>
						</uni-forms-item>
						<uni-forms-item label="截止时间" label-width="auto">
							<view class="border-b-grey p-10">
								<uni-datetime-picker type="datetime" return-type="string" v-model="formData.endat"
									:border="false" />
							</view>
						</uni-forms-item>
						<!-- <uni-forms-item label="最多选择项数" label-width="auto">
							<view class="border-b-grey p-10">
								<uni-easyinput v-model="formData.vmax" placeholder="0表示必须全选" :inputBorder="false" />
							</view>
						</uni-forms-item> -->
						<uni-forms-item label="总票数" label-width="auto">
							<view class="border-b-grey p-10">
								<uni-easyinput v-model="formData.ticketall" placeholder="票数" :inputBorder="false" />
							</view>
						</uni-forms-item>
						<uni-forms-item label="总面积" label-width="auto">
							<view class="border-b-grey p-10">
								<uni-easyinput v-model="formData.areaall" placeholder="平方米" :inputBorder="false" />
							</view>
						</uni-forms-item>
						<uni-forms-item label="活动状态" label-width="auto">
							<view class="bg-white border-radius-base p-10">
								<switch style="transform:scale(0.7)" @change="changepub" :checked="formData.pub"></switch>
							</view>
						</uni-forms-item>
					</view>
					<view class="na-title-sm p-t-30 p-lr-30">
						审核部门
					</view>
                    <view class="bg-white na-main p-tb-20">
						<uni-forms-item label="审核部门" label-width="auto">
							<view class="">
								<ber-group :groupid="zone_detail.id" @checked="chooseGroup"></ber-group>
							</view>
						</uni-forms-item>
                    </view>
					<view class="na-title-sm p-t-30 p-lr-30">
						活动内容
					</view>
					<view class="bg-white p-30">
						<ber-editor @inputFn="(val)=>{
                            formData.content = val
                        }" placeholder="请输入内容..." id="editor" :val="formData.content"></ber-editor>
					</view>
					<view class="na-main m-tb-30">
						<button type="primary" @click="submit">提交</button>
					</view>
				</uni-forms>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		postActivity,
        postAudit,
	} from './service/api.js'
    import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				formData: {
					type: 4,//联名
					author_type:2,//发布人所在区域类型：小区
					author_tgt:'',
					author_cc:'',
					name:'',
					startat: '',
					endat: '',
					content: '',
                    vmax:'',
					ticketall:'',
					areaall:'',
					pub:false,
					vrule:[{
						vmax:'',
						vmin:1,
						voptext:''
					}]
				},
				// 活动题目
                // 下拉刷新的配置(可选, 绝大部分情况无需配置)
                downOption: { },
                // 上拉加载的配置(可选, 绝大部分情况无需配置)
                upOption: {
                    noMoreSize: 0 // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
                },
                zone_detail:{},
                group_id:'',
			}
		},
		onLoad() {
            this.zone_detail = this.utils.getUserZone()
		},
		computed: {
			
		},
		methods: {
            chooseGroup(e){
                this.group_id = e.id
            },
            changepub(e) {
            	this.formData.pub = e.detail.value
            },
            // 下拉刷新回调
            downCallback() {
                this.mescroll.resetUpScroll()
            },
            submit() {
                uni.showModal({
                	title: '提示',
                	content: '确定提交么？',
                	success: res => {
                        if (res.confirm) {
                            let data = {
                            	...this.formData
                            }
                            data.author_tgt = this.zone_detail.id
                            data.author_cc = this.zone_detail.china_code
                            if(!data.startat) {
                                data.startat = ''
                            }else {
                                if (data.startat.length == 11) {
                                	data.startat += '00:00:00'
                                }
                            }
                            if(!data.endat) {
                                data.endat = ''
                            }else {
                                if (data.endat.length == 11) {
                                    data.endat += '23:59:59'
                                }
                            }
                            // 判断活动状态(开放、关闭)
                            if (data.pub == true) {
                            	data.pub = 1
                            } else {
                            	data.pub = 0
                            }
                            postActivity(data).then(res=>{
                                if(res.statusCode === 200) {
                                    postAudit({tgt_type:'survey',tgt_id:res.data.id,group_id:this.group_id}).then(res2=>{
                                        uni.showToast({
                                        	icon: 'none',
                                        	title: '添加成功',
                                        	duration: 1000,
                                        	mask:true
                                        })
                                    })
                                }
                                setTimeout(() => {
                                	let pages = getCurrentPages();
                                	let prevPage = pages[pages.length - 2];
                                	if(prevPage.$vm.downCallback){
                                		prevPage.$vm.downCallback();  
                                	}
                                	if(prevPage.$vm.getBackArticleId){
                                		prevPage.$vm.getBackArticleId(res.data.id);  
                                	}
                                	uni.navigateBack()
                                }, 1000)
                            })
                        }
                    }
                })
            }
		}
	}
</script>

<style lang="scss" scoped>
</style>
