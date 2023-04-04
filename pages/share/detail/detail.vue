<template>
    <view>
        <view class="na-header-white m-b-10">
            <headbar fixed="true" title="过户业务详情"></headbar>
            <view class="na-main">
                <view class="flex-row flex-between flex-center">
                    <view>
                        <view class="h2 over-ellipsis">业务编号：{{share_detail.sno}}</view>
                        <view class="p-tb-10">
                           <!-- 10待补充材料、11待公众补充材料、12待不动产中心补充材料、20已共享、40已结束共享、41公众主动放弃共享 -->
                            <text class="na-tag3" v-if="share_detail.status === 10">待补充材料</text>
                            <text class="na-tag1" v-else-if="share_detail.status === 11">待公众补充材料</text>
                            <text class="na-tag1" v-else-if="share_detail.status === 12">待不动产中心补充材料</text>
                            <text class="na-tag1" v-else-if="share_detail.status === 20">已共享</text>
                            <text class="na-tag2" v-else-if="share_detail.status === 40">已结束</text>
                            <text class="na-tag2" v-else-if="share_detail.status === 41">主动放弃共享</text>
                        </view>
                    </view>
                    <!-- <view class="btn-secondary btn-size-xs" @click="clickFuncDelte(share_detail.id)">
                        停止共享
                    </view> -->
                </view>
                <view class="" v-if="share_detail.uinfo">
                    <text class="size-sm font-grey m-r-20">申请人：{{share_detail.uinfo.name}}</text>
                    <text class="size-sm font-grey">申请时间：{{share_detail.updated_at}}</text>
                </view>
            </view>
        </view>
        <view class="na-main m-t-20">
            <!-- 过户房屋基本信息 -->
            <!-- <view class="bg-white na-card p-30 size-base" v-if="share_detail.uinfo">
                <view class="na-title-sm p-b-20">
                    房屋信息
                </view>
                <view class="m-tb-10">
                    <text class="font-grey">房屋坐落：</text>
                    {{share_detail.uinfo.house.house_addr}}
                </view>
				<view class="m-tb-10">
				    <text class="font-grey">不动产登记号：</text>
				    {{share_detail.uinfo.house.bdc_sno}}
				</view>
				<view class="m-tb-10">
				    <text class="font-grey">不动产单元号：</text>
				    {{share_detail.uinfo.house.bdc_uno}}
				</view>
            </view> -->
            <view class="bg-white na-card p-30 size-base" v-if="share_detail.house">
                <view class="na-title-sm p-b-20">
                    房屋信息
                </view>
                <view class="m-tb-10">
                    <text class="font-grey">房屋坐落：</text>
                    {{share_detail.house.house_addr}}
                </view>
            	<view class="m-tb-10">
            	    <text class="font-grey">不动产登记号：</text>
            	    {{share_detail.house.bdc_sno}}
            	</view>
            	<view class="m-tb-10">
            	    <text class="font-grey">不动产单元号：</text>
            	    {{share_detail.house.bdc_uno}}
            	</view>
            </view>
            <!-- 业务材料 -->
			<view class="na-title-sm flex-row flex-between p-tb-30">
				<text>申办业务</text>
				<view class="btn-extra btn-size-xs" @click="showDownloadList" >
					查看下载记录
				</view>
			</view>
            <view class="na-card" v-if="share_detail.business">
                <view v-for="(item,i) in share_detail.business" :key="item.id" class="na-card bg-white over-hidden m-b-20">
					<view class="flex-row flex-center flex-between p-30 bg-linear-green2white" style="border-radius: 20rpx 20rpx 0 0;">
						<view class="flex-column" v-if="item.sharebiz">
							<view class="font-primary p-b-10">
								{{item.sharebiz.group.name}}
							</view>
							<view>
								<text class="font-grey size-sm">业务：</text>
								<text class="font-grey size-base">{{item.sharebiz.title}}</text>
							</view>
						</view>
						<view class="font-grey size-sm" @click="showBusiness(item)">
							查看用户协议
						</view>
					</view>
                    <view v-for="content in item.sharebiz.bizmaterials" :key="content.id">
                        <view v-if="content.cpt.sharefile.src === 1">
                            <view class="p-lr-30 p-tb-10 size-base flex-row flex-between" v-if="content.cpt.sharefile.type === 1">
                            	<view>
                            		<span class="font-grey">{{content.cpt.sharefile.title}}：</span>
                            		<span>{{content.cpt.content}}</span>
                            	</view>
                            	<view v-if="content.cpt.content && content.cpt.status === 20"></view>
                                <view v-else class="m-l-40 btn-secondary btn-size-xs" @click="addMaterials(content.cpt)">
                                    补充材料
                                </view>
                            </view>
						</view>
						<view class="p-lr-30 p-tb-10 size-base flex-row flex-between" v-if="content.cpt.sharefile.type === 2">
							<view style="width: 100%;">
								<view class="font-grey">{{content.cpt.sharefile.title}}：</view>
								<view class="p-t-20" v-if="content.picture[0] && content.cpt.status === 20">
									<view class="na-photo-box">
										<view class="photo-item" v-for="src in content.picture">
											<view class="photo-item-image">
												<image @click="clickFuncImgShow(content.picture,src)" :src="src" mode="aspectFill"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view v-if="content.picture[0] && content.cpt.status === 20"></view>
							<view v-else>
								<button class="btn-secondary btn-size-xs" @click="addMaterials(content.cpt)" :disabled="content.cpt.sharefile.src !== 1">
									补充材料
								</button>
							</view>
						</view>
                        <!-- 用户签名 -->
                        <!-- 只在第一个业务显示用户签名 -->
                        <view class="p-lr-30 p-tb-10 size-base" v-if="content.cpt.sharefile.type === 4 && i===0">
                        	<view class="font-grey">{{content.cpt.sharefile.title}}：</view>
                        	<!-- <view class="bg-white m-t-20 p-b-20" v-if="content.picture[0] && content.cpt.status === 20">
                        		<view v-for="src in content.picture">
                        			<image @click="clickFuncImgShow(content.picture,src)" :src="src" style="width:180px;height:60px;" mode="aspectFill"></image>
                        		</view>
                        	</view> -->
                            <view class="bg-white m-t-20 p-b-20" v-if="sign_detail[content.cpt.fid]">
                            	<image @click="clickFuncImgShow(content.picture,sign_detail[content.cpt.fid])" :src="sign_detail[content.cpt.fid]" style="width:180px;height:60px;" mode="aspectFill"></image>
                            </view>
                        	<view v-else class="bg-white m-t-20 p-b-20">
                        		<am-sign-input canvasId="twoDrowCanvas" canvasIds="twoRotateCanvas" @signToUrl="(data)=>{
                        			twoSignToUrl(content.cpt,data)
                        		}"> </am-sign-input>
                        	</view>
                        </view>
                    </view>
                </view>
            </view>
			<view class="p-30"></view>
        </view>
        <uni-popup ref="popup" type="bottom">
            <view class="align-center strong">
                待补充的材料
            </view>
            <view class="m-tb-20">
                <view v-if="add_materials_content.sharefile">
                    <text>{{add_materials_content.sharefile.title}}:</text>
                    <view v-if="add_materials_content.sharefile.type === 1">
                       <uni-easyinput class="na-input" placeholder="请输入" v-model="content"/>
                    </view>
                    <view class="p-tb-20" v-else-if="add_materials_content.sharefile.type === 2 || add_materials_content.sharefile.type === 4">
                        <uni-file-picker @select="(val)=>{
                        	affix = affix.concat(val.tempFiles) 
                        }" @delete="deleteFileFunc" limit="9" :auto-upload="false" ></uni-file-picker>
                    </view>
                </view>
            </view>
        	<view><button type="primary" @click="submit">提交</button></view>
        </uni-popup>
        <!-- 用户协议 -->
		<uni-popup ref="business" type="bottom">
			<view v-if="business.sharebiz">
				<view class="align-center strong">
					{{business.sharebiz.title}}
				</view> 
				<scroll-view scroll-y="true" class="m-tb-20 line-height-180" style="height:60vh;">
					<jyf-parser :html="business.sharebiz.desc" ref="article" :lazy-load="true" :use-anchor="true"
						show-with-animation :selectable="true">加载中...</jyf-parser>
				</scroll-view>
			</view>
		</uni-popup>
        <!-- 下载记录 -->
        <uni-popup ref="download" type="bottom">
            <view class="align-center strong">
                材料下载记录
            </view>
            <scroll-view scroll-y="true" class="m-tb-20 line-height-180" style="height:60vh;">
                <!-- <uni-table border stripe emptyText="暂无更多数据">
                    <uni-tr>
                		<uni-th align="center">姓名</uni-th>
                		<uni-th align="center">手机号</uni-th>
                		<uni-th align="center">用户组</uni-th>
                        <uni-th align="center">用户组职位</uni-th>
                	</uni-tr>
                    <uni-tr v-for="item in this.download_list">
                        <uni-td align="center">{{item.stub.name || item.stub.nickname || item.stub.username}}</uni-td>
                        <uni-td align="center">{{item.stub.mobile}}</uni-td>
                        <uni-td align="center">{{item.stub.group_name}}</uni-td>
                        <uni-td align="center">{{item.stub.group_post}}</uni-td>
                    </uni-tr>
                </uni-table> -->
                <view class="na-steps-column">
                    <view class="na-steps-column-item" v-for="(item,i) in download_list" :key="item.id">
                        <view class="steps-item-time">
                        	{{item.updated_at}}
                        </view>
						<view class="size-base font-grey">{{ item.stub.nickname || item.stub.username}} {{item.stub.mobile}}</view>
                        <view class="size-sm font-grey">
                        	<text class="p-r-20">{{item.stub.group_name}}</text>
                        	<text>{{item.stub.group_post}}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </uni-popup>
    </view>
</template>

<script>
    import {
        getShareRecordDetail,
        stopShareRecord,
        putShareRecordMaterial,
        getShareRecordDownloadList
    } from './service/api.js'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
    import GetFilesKey from '@/pages/framework/utils/file/file.js'
    export default {
        data() {
            return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
                id:'',
                share_detail:{},//共享记录详情
                add_materials_content:{},//待补充的共享记录材料
                content:'',//补充的材料内容
                affix:[],
				business:{},
				is_sign:false,//判断用户是否需要输入电子签名
				sign_detail:[],//存储签名的信息
                download_list:[],//下载记录
            }
        },
        onLoad(opt) {
            this.id = opt.id
            this.getDetail(this.id)
        },
        methods: {
            getDetail(id) {
                getShareRecordDetail(id).then(res=>{
                    res.data.business.map(item => {
                        item.sharebiz.bizmaterials.map(share_detail => {
                            if(share_detail.cpt.sharefile.type === 2 || share_detail.cpt.sharefile.type === 4) {
                                share_detail.picture = []
                                share_detail.picture = share_detail.cpt.content.split(",")
                                for(let i in share_detail.picture) {
                                    if(share_detail.picture[i]) {
                                        share_detail.picture[i] = VITE_APP_FOLDER_SRC+share_detail.picture[i]
                                    }
                                    // 处理用户签名
                                    if(share_detail.cpt.sharefile.type === 4) {
                                        this.sign_detail[share_detail.fid] = share_detail.picture[i]
                                    }
                                }
                            }
                        })
                    })
                    this.share_detail = res.data
                    this.share_detail.house = res.data.uinfo.house
                })
            },
            // 停止记录的共享
            clickFuncDelte(id) {
                stopShareRecord(id).then(res=>{
                    uni.showToast({
                    	icon:'none',
                    	title:"已停止该记录的共享",
                        duration:1500
                    })
                    setTimeout(()=>{
                        this.getDetail(this.id)
                    },1500)
                })
            },
            // 补充材料
            addMaterials(item) {
                this.add_materials_content = item
                this.content = ''
                this.affix = []
                this.$refs.popup.open()
            },
			showBusiness(item){
				this.business = item
				this.$refs.business.open()
			},
            showDownloadList(){
                this.$refs.download.open()
                let data = {
                    page:1,
                    per_page:50,
                    rid:this.share_detail.id
                }
                getShareRecordDownloadList(data).then(res=>{
                    this.download_list = res.data
                })
            },
            // 预览图片
            clickFuncImgShow(arr,url){
            	uni.previewImage({
            		current:url,
            		urls: arr,
            	});
            },
            // 删除图片
            deleteFileFunc(val){
            	for(let i in this.affix){
            		if(this.affix[i].url == val.tempFile.url){
            			this.affix.splice(i,1)
            			return false
            		}
            	}
            },
			// 处理电子签名
			twoSignToUrl(item,e) {
				this.add_materials_content = item
				let content = []
				let _this = this
			    GetFilesKey('sign',[e],['png']).then(res=>{
			        content = res.join()
					// 异步的bug:图片上传未完成就已经执行
					setTimeout(()=>{
						putShareRecordMaterial(_this.add_materials_content.id,{'content':content,'status':20}).then(res=>{
							_this.getDetail(_this.id)
						})
					},500)
			    })
				
			},
            // 提交补充的材料
            putMaterial() {
                putShareRecordMaterial(this.add_materials_content.id,{'content':this.content,'status':20}).then(res=>{
                    this.$refs.popup.close()
                    this.getDetail(this.id)
                })
            },
            // 提交补充的材料
            submit() {
                uni.showModal({
                    title:'提示',
                    content:'确定提交么？',
                    success:res => {
                        if(res.confirm) {
                            if(this.affix.length>0) {
                                new Promise((resolve, reject) => {
                                    let arr = []
                                    let type = []
                                    for(let i in this.affix){
                                    	arr.push(this.affix[i].url)
                                        type.push(this.affix[i].extname)
                                    }
                                    GetFilesKey('record',arr,type).then(res=>{
                                    	this.content = res.join()
                                        resolve(this.content)
                                    })
                                }).then(res => {
                                    this.putMaterial()
                                })
                            }else {
                                this.putMaterial()
                            }
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.na-steps-column-item {
    padding-bottom: 0;
    padding-top: 0;
}
</style>
