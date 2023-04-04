<template>
    <view>
        <headbar title="水电气暖过户申请" fixed="true" rightText="申请记录" @clickRight="clickRight"></headbar>
        <view>
            <uni-forms ref="form" :modelValue="formData" label-position="left" label-align="left" label-width="50">
                <view class="bg-white p-30">
                    <view v-if="user_house" class="na-main over-hidden">
                    	<view class="over-hidden na-card p-30 bg-linear-green2white">
                    		<view class="font-primary size-lg">{{user_house.name||user_house.pos_name}}</view>
                    		<view class="font-grey p-t-20">地址：{{user_house.addr}}</view>
                    	</view>
                    </view>
                    <uni-forms-item label="数据共享截止时间" label-width="auto">
                    	<view class="border-b-grey p-10">
                            <uni-datetime-picker type="datetime" :start="limit_start_at" :end="limit_end_at" return-type="string" v-model="formData.end_at" :border="false" />
                    	</view>
                    </uni-forms-item>
                    <uni-forms-item label="请选择申请的业务类别" label-width="auto">
                    </uni-forms-item>
                    <view class="m-t-20">
                        <checkbox-group class="flex-row flex-around" @change="checkboxChange">
                            <label v-for="(item,index) in choose_list" :key="item.val">
                                <checkbox :value="item.key" :checked="item.checked" style="transform:scale(0.7)"/>{{item.val}}
                            </label>
                        </checkbox-group>
                    </view>
                </view>
                <!-- 水电气 -->
                <block v-for="(item,index) in choose_list">
                    <view v-if="choose_list[index]">
                        <view class="bg-white m-t-20 p-30" v-if="choose_list[index].checked">
                            <uni-forms-item label="选择受理单位" label-width="auto">
                            	<view class="border-b-grey p-tb-30 p-20">
                                    <picker @change="chooseGroup($event,index)" :range="group_list[index]" :value="pindex" range-key="val">
                                    	<view>{{group_choosed[index] || '请选择受理单位' }}</view>
                                    </picker>
                            	</view>
                            </uni-forms-item>
                            <uni-forms-item label="选择办理业务" label-width="auto">
                            	<view class="border-b-grey p-tb-30 p-20">
                                    <picker @change="chooseBusiness($event,index)" :range="business_list[index]" :value="pindex" range-key="val">
                                    	<view>{{business_choosed[index] || '请选择办理业务' }}</view>
                                    </picker>
                            	</view>
                            </uni-forms-item>
                            <!-- 需要提交的材料 -->
                            <view v-if="material_list">
                                <block v-for="item in material_list[index]">
                                    <view v-if="item.sharefile.src === 1">
                                        <view v-if="item.sharefile.type === 1">
                                            <uni-forms-item :label="item.sharefile.title" label-width="auto">
                                            	<view class="border-b-grey p-10">
                                            		<uni-easyinput placeholder="请输入" @blur="inputFunc($event,item.sharefile.id)" :inputBorder="false" />
                                            	</view>
                                            </uni-forms-item>
                                        </view>
                                        <view  v-if="item.sharefile.type === 2">
                                            <uni-forms-item :label="item.sharefile.title" label-width="auto">
                                                <icon type="info" size="20" @click="showIntroduce"/>
                                            </uni-forms-item>
                                            <view>
                                                <uni-file-picker @select="selectFileFunc($event,index,item.sharefile.id)" @delete="deleteFileFunc($event,index)" limit="5" :auto-upload="false"></uni-file-picker>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                            </view>
                            <view class="m-t-20" v-if="business_choosed[index]">
                                <view  @click="clickRadio(index)">
                                    <label class="radio">
										<radio style="transform:scale(0.7)" :checked="contract_status_list[index]" disabled/>
									</label>
                                    <text class="size-base font-grey">我已阅读并同意该业务《<text class="font-primary">服务条款</text>》</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </block>
               <!-- 提交验证 -->
                <view class="bg-white m-t-20 p-30">
                    <!-- <uni-forms-item label="验证码" label-width="auto">
                    	<view class="border-b-grey p-10">
                    		<uni-easyinput v-model="formData.cert_id" placeholder="请输入验证码" :inputBorder="false" />
                    	</view>
                    </uni-forms-item> -->
                    <view class="">
                        <view class="font-grey size-base">
                            请在签名区进行签名
                        </view>
						<view class="flex-column flex-center p-tb-20">
							<am-sign-input canvasId="twoDrowCanvas" canvasIds="twoRotateCanvas" @signToUrl="twoSignToUrl"> </am-sign-input>
						</view>
                    </view>
                    <view class="" @click="clickRadio('sign')">
                        <label class="radio"><radio style="transform:scale(0.7)" :checked="contract_sign_status" disabled/></label>
                        <text class="size-base font-grey">我已阅读并签名同意《<text class="font-primary">不动产登记水电气视物业联办过户告知书</text>》</text>
                    </view>
                    <view class="btn-primary btn-size-base btn-block m-t-20" @click="issubmit">提交申请</view>
                </view>
            </uni-forms>
        </view>
        <!-- 协议弹窗 -->
        <uni-popup ref="contract" type="bottom" :mask-click="false">
            <view class="" style="overflow: auto;max-height:80vh;">
                <view class="line-height-170">
                    <jyf-parser :html="contract_show" ref="article" :lazy-load="true" :use-anchor="true" show-with-animation :selectable="true">加载中...</jyf-parser>
                </view>
                <view class="flex-row">
                    <view class="btn-danger btn-block btn-size-base" @click="closePopup">关闭</view>
                    <view class="btn-primary btn-block btn-size-base" @click="agreeFunc">同意</view>
                </view>
            </view>
        </uni-popup>
        <!-- 图片样例介绍 -->
        <uni-popup ref="popup" type="center" :mask-click="false">
            <view class="" style="max-width: 500rpx;">
                <view class="align-center size-lg m-tb-30">
                    图片样例介绍
                </view>
                <view class="font-grey">
                    上传图片必须清晰可见，照片内容真实有效，不得做任何修改。支持.jpg.jpeg格式照片，大小不超过5M。
                </view>
            </view>
            <view class="btn-danger btn-block p-20 m-t-20" @click="closePopup">
                关闭
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import {
        getShareBusinessKind,
        getShareBusinessAllData,
        getShareBusinessList,
        postShareRecord,
        getShareBusinessMaterial,
        getRecord
    } from './service/api.js'
    import {VITE_APP_FOLDER_SRC} from '@/pages/framework/config/app.js'
    import GetFilesKey from '@/pages/framework/utils/file/file.js'
    export default {
        data() {
            return {
                VITE_APP_FOLDER_SRC:VITE_APP_FOLDER_SRC,
                formData:{
                    hid:'',
                    end_at: Date.now() + 1296000000,
                    bids:[],//业务id
                    material:[],//材料
                },
				limit_start_at: Date.now() + 1296000000,
				limit_end_at: Date.now() + 12960000000,
                picture:[],//存图片
                user_info:'',//用户信息
				user_house:{},
                choose_list:[],//水电气暖选择的列表
                group_list:[],//不同业务类别对应的用户组
                business_list:[],//不同业务类别对应的用户组下的业务
                material_list:[],// 业务材料
                group_choosed:[],//已选的用户组
                business_choosed:[],//已选的业务名称
                contract_list:[],//已选的业务协议书名称
                contract_show:'',//需要展示的协议书内容
                contract_status_list:[],//水电气暖协议书的选中状态
                contract_sign_status:false,//平台协议的选中状态
                defaultHouse:'',
                // 数字签名
                is_sign:false,//判断用户是否需要输入电子签名
                sign_detail:{},//存储签名的信息
                own_contract:"",//平台协议
                // 同意相关协议的判断变量
                is_own_contract:false,//是否是平台协议
                contract_index:0,// 业务的协议索引，用于控制相应业务协议的勾选
				pindex:0,
            }
        },
        onLoad() {
			this.getShareBusinessKindFunc()
        },
		onShow() {
			this.user_house = this.utils.getUserHouse();
			// 判断本地缓存是否存在房屋数据
			if(Object.keys(this.user_house).length<=0) {
			    uni.showToast({
			    	icon:'none',
			    	title:"暂无绑定房屋",
			        duration:1500
			    })
			    // console.log("暂无绑定房屋");
			    // 小问题：如果用户本地缓存没有房屋信息，需要跳转相应房屋绑定页，绑定完成后放回原页面没有刷新
			    setTimeout(()=>{
			        this.utils.route('/pages/mine/house/house')
			    },1500)
			    return
			}
			this.formData.hid = this.user_house.id
		},
        methods: {
			getShareBusinessKindFunc(){
				// 获取业务种类
				getShareBusinessKind().then(res=>{
					this.choose_list = res.data.map((item,index)=>{
						this.contract_status_list.push(false)
						// console.log("index",index,item.id);//业务种类id（kid）
						// 获取第一个业务种类下的所有业务数据
						if(!index) {
							// console.log("index",index);
							this.getBusinessAllData(index,item.id)
						}
						return {
							key:index+'',//checkbox绑定的key需要是字符串
							val:item.title,
							checked:index === 0 ? true : false,//默认选中第一个业务
							id:item.id,
						}
					})
				})
				// 平台协议
				getRecord().then(res=>{
				    this.own_contract = res.data.text
				})
			},
            // 申请记录
            clickRight() {
                // console.log("点击了申请记录");
                this.utils.route('/pages/share/history/history')
            },
            // 点击选择不同的业务类型
            checkboxChange(e) {
                // console.log("e",e);//包含已选选项key的数组
                let arr = e.detail.value
                this.choose_list.map(item => {
                    // 判断选项是否被选中
                    if(arr.indexOf(item.key) > -1) {
                        if(!item.checked) {//如果checked为false，表示该业务类型没有选中，需要获取对应业务数据
                            this.getBusinessAllData(item.key,item.id)
                        }
                        item.checked = true
                    }else {
                        item.checked = false
                    }
                })
            },
            // 获取业务种类下的所有业务数据
            getBusinessAllData(index,kid) {
                getShareBusinessAllData({'kid':kid}).then(res=>{
                    this.group_list[index] = res.data.map((v,i)=>{
                        return {
                            key:i,
                            val:v.name,
                            id:v.id,
                            sharebiz:v.sharebiz//业务数据
                        }
                    })
                    this.$forceUpdate()
                })
            },
            // 选中了用户组
            chooseGroup(e,index) {
                // console.log("e",e.detail.value);//所选用户的索引
                let arr = this.group_list[index][e.detail.value]//选中的用户组的对象
                this.group_choosed[index] = arr.val
                this.business_list[index] = arr.sharebiz.map((item,i)=>{
                    return {
                        key:i,
                        val:item.title,
                        id:item.id,
                        desc:item.desc,
                        bizmaterials:item.bizmaterials,//业务材料（要件列表）
                    }
                    this.$forceUpdate()
                })
                // console.log("arr.sharebiz",this.business_list[index]);
                this.$forceUpdate()
            },
            // 选中了业务
            chooseBusiness(e,index) {
                let arr = this.business_list[index][e.detail.value]//选中的业务的对象
                this.contract_list[index] = arr.desc//所选业务的协议书
                this.business_choosed[index] = arr.val//所选业务的标题
                // 选中业务小bug，第一次点击确定没有更新
                this.$forceUpdate()
                this.material_list[index] = arr.bizmaterials//所选业务的材料
                // 如果电子签名没有显示，需要判断是否存在需要显示电子签名要件
                if(!this.is_sign) {
                    for(let i in arr.bizmaterials) {
                        if(arr.bizmaterials[i].sharefile.type === 4) {
                            this.is_sign = true
                            this.sign_detail.fid = arr.bizmaterials[i].sharefile.id
                            return
                        }
                    }
                }
                // console.log("arr.bizmaterials",arr.bizmaterials);
                this.$forceUpdate()
            },
            // 输入文本框失去焦点事件
            inputFunc(e,id) {
                // console.log("e",e.detail.value,id);
                this.formData.material.push({
                    fid:id,
                    content:e.detail.value
                })
            },
            // 选择图片
            selectFileFunc(val,index,id) {
                // console.log("val",val);
                if(!this.picture[index]) {
                    this.picture[index] = []
                }
                // this.picture[index] = this.picture[index].concat(val.tempFilePaths)
                this.picture[index] = this.picture[index].concat(val.tempFiles)
                this.picture[index].fid = id
            },
            // 删除图片
            deleteFileFunc(val,index){
                let i = this.picture[index].indexOf(val.tempFilePath)
                this.picture[index].splice(i,1)
            },
            // 打开图片样例介绍弹窗
            showIntroduce() {
                // console.log("展示图片样例介绍");
                this.$refs.popup.open()
            },
            // 点击同意业务合同
            agreeFunc() {
                if(this.is_own_contract) {
                    this.contract_sign_status = true
                }else {
                    this.contract_status_list[this.contract_index] = true
                }
                this.$forceUpdate()
                this.closePopup()
            },
            // 点击协议书
            clickRadio(index) {
                // 切换协议选中状态
                // console.log("contract_status_list",this.contract_status_list);
                // 控制是业务的协议书还是总的协议书
                if(index === 'sign') {
                    this.is_own_contract = true
                    // 从未选中状态变为选中状态需要打开弹窗书写电子签名
                    if(!this.contract_sign_status) {
                        // 平台协议内容
                        this.contract_show = this.own_contract
                        this.$refs.contract.open()
                    }else {
                        // true => false
                        this.contract_sign_status = !this.contract_sign_status
                    }
                }else {
                    this.is_own_contract = false
                    this.contract_index = index
                    if(!this.contract_status_list[index]) {
                        // 协议内容
                        this.contract_show = this.contract_list[index]
                        this.$refs.contract.open()
                    }else {
                        this.contract_status_list[index] = !this.contract_status_list[index]
                    }
                }
                this.$forceUpdate()
            },
            // 关闭弹窗
            closePopup() {
                this.$refs.popup.close()
                this.$refs.contract.close()
            },
            // 判断是否勾选了相关协议
            issubmit() {
                if(!this.contract_sign_status) {
                    this.showMessage("请勾选相关协议书")
                    return
                }else {
                    // 遍历已选业务种类
                    for(let i in this.choose_list) {//不推荐使用map，return不能跳出循环
                        if(this.choose_list[i].checked) {
                            // 判断业务种类对应的业务是否勾选了协议书
                            if(!this.contract_status_list[i]) {
                                this.showMessage("请勾选相关协议书")
                                return
                            }
                        }
                    }
                    setTimeout(()=>{
                        this.submit()
                    },300)
                }
            },
            submit() {
                uni.showModal({
                    title:'提示',
                    content:'确定提交么？',
                    success:res => {
                        if(res.confirm) {
                            // 遍历传图片的要件
                            for(let i in this.picture) {
                                if(this.picture[i].length>0) {
                                    let arr = []
                                    let type = []
                                    // 将数组内添加的
                                    for(let j in this.picture[i]) {
                                        if(j != "fid") {
                                            // arr.push(this.picture[i][j])
                                            arr.push(this.picture[i][j].url)
                                            type.push(this.picture[i][j].extname)
                                        }
                                    }
                                    console.log("arr",arr,type);
                                    GetFilesKey('water',arr,type).then(res=>{
                                        // console.log("res",res.join())
                                        this.formData.material.push({
                                            fid:this.picture[i].fid,
                                            content:res.join()
                                        })
                                    })
                                    // console.log("this.formData",this.formData);
                                }
                            }
                            // 将已选业务传入bids
                            this.formData.bids = []
                            this.choose_list.map((item,i)=>{
                                if(item.checked) {
                                    // 传错id
                                    // this.formData.bids.push(item.id)
                                    this.formData.bids.push(this.business_list[i][0].id)
                                }
                            })
                            // 判断是否有电子签名
                            if(this.is_sign) {
                                this.formData.material.push(this.sign_detail)
                            }
                            // 延迟执行，否则实际请求会缺失图片要件对应的数据
                            setTimeout(()=>{
                                postShareRecord(this.formData).then(res=>{
                                    this.showMessage("提交成功")
                                    setTimeout(()=>{
                                    	uni.navigateBack()
                                    },1000)
                                })
                            },500)
                        }else if(res.cancel) {
                            console.log("用户点击了取消");
                        }
                    }
                })
            },
            // 处理电子签名
            twoSignToUrl(e) {
                GetFilesKey('sign',[e],['png']).then(res=>{
                    this.sign_detail.content = res[0]
                })
            },
            // 提示信息
            showMessage(content) {
                uni.showToast({
                	icon:'none',
                	title:content,
                    duration:1000
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    
</style>
