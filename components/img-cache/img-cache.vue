<template>
    <view class="img-bbsb">
        <template v-if="imgSrc&&!error">
            <image v-if="showImg" class="img-item" :src="imgUrl" :mode="imgMode" @error="errorFunc" @load="loadFunc" @click="previewImageFunc" />
        </template>
        <template v-if="imgSrc&&!ok&&!error">
            <img-loading class="img-item" :bg="loadBg" :color="loadColor" />
        </template>
        <template v-if="error||!imgSrc">
            <img-error class="img-item" :bg="loadBg" :color="loadColor" />
        </template>
    </view>
</template>

<script>
	// 图片缓存
	// <img-cache :img-src="src" :img-src-index="0" :img-src-arr="[src]" :cache="true" :cache-time="5" :style="'height:100px;width:100px;'" />
export default {
    name: 'ImgCache',
    props: {
        // 加载404背景
        loadBg: {
            type: String,
            default: '#eee'
        },
        // 加载404颜色
        loadColor: {
            type: String,
            default: '#000'
        },
        // 图片链接，索引，预览数组
        imgSrc: {
            type: String,
            default: ''
        },
        imgSrcIndex: {
            type: Number,
            default: 0
        },
        imgSrcArr: {
            type: Array,
            default: () => []
        },
        // 图片裁剪方式
        imgMode: {
            type: String,
            default: 'aspectFill'
        },
        // 是否缓存
        cache: {
            type: Boolean,
            default: false
        },
        // 缓存时间
        cacheTime: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            imgUrl: '',
            error: false,
            ok: false,
            folderName: 'cached_image',
            cacheExpire: 'expire_2022_02_11_14_22',
            showImg: true
        }
    },
    created() {
        let _this = this
        // #ifdef APP-PLUS
        let fName = this.folderName + this.imgSrc
        let fTime = this.cacheExpire + this.imgSrc 
        if (this.cache) {
            let isCache, isExpire 
            try {
                isCache = uni.getStorageSync(fName)
                isExpire = uni.getStorageSync(fTime)
            } catch (e) {
                // error
                _this.imgUrl = _this.imgSrc
            }
            let nowtime = new Date().getTime()
            if (isCache) {
                if (isExpire > nowtime) {
                    // 缓存存在 更新
                    this.imgUrl = isCache
                    let uptime = nowtime + this.cacheTime * 24 * 60 * 60 * 1000
                    try {
                        uni.setStorageSync(fTime, uptime)
                    } catch (e) {
                        // error
                        _this.imgUrl = _this.imgSrc
                    }
                    return false
                } else {
                    // 缓存过期 删除文件？？？
                    this.imgUrl = this.imgSrc
                    uni.removeSavedFile({
                        filePath: isCache
                    })
                    uni.removeStorage({
                        key: fName
                    })
                    uni.removeStorage({
                        key: fTime
                    })
							
                }
            } else {
                // 未获取到缓存 保存缓存
                uni.downloadFile({
                    url: _this.imgSrc, // 仅为示例，并非真实的资源
                    success: res => {
                        if (res.statusCode == 200) {
                            uni.saveFile({
                                tempFilePath: res.tempFilePath,
                                success: function(res) {
                                    let uptime = new Date().getTime() + _this.cacheTime * 24 * 60 * 60 * 1000
                                    try {
                                        uni.setStorageSync(fName, res.savedFilePath)
                                        uni.setStorageSync(fTime, uptime)
                                        _this.imgUrl = res.savedFilePath
                                    } catch (e) {
                                        // error
                                        _this.imgUrl = _this.imgSrc
                                    }
                                },
                                fail: function(err) {
                                    _this.imgUrl = _this.imgSrc
                                }
                            })
                        } else {
                            _this.imgUrl = _this.imgSrc
                        }
                    },
                    fail: err => {
                        _this.imgUrl = _this.imgSrc
                    }
                })
            }
        } else {
            this.imgUrl = this.imgSrc
        }
        // #endif
		// #ifdef H5
			this.imgUrl = this.imgSrc
		// #endif
    },
    methods: {
        // 预览 必须传入index和arr
        previewImageFunc() {
            if (this.imgSrcArr.length > 0) {
                uni.previewImage({
                    current: this.imgSrcIndex,     // 当前显示图片的链接/索引值
                    urls: this.imgSrcArr,    // 需要预览的图片链接列表，photoList要求必须是数组
                    loop: true   // 是否可循环预览
                })
            }
        },
        errorFunc() {
            if (this.imgUrl != this.imgSrc) {
                this.showImg = false
                let fName = this.folderName + this.imgSrc
                let fTime = this.cacheExpire + this.imgSrc 
                uni.removeStorage({
                    key: fName
                })
                uni.removeStorage({
                    key: fTime
                })
                this.$nextTick(() => {
                    this.imgUrl = this.imgSrc
                    this.showImg = true
                })
            } else {
                this.error = true
            }
            // console.log('error')
        },
        loadFunc() {
            this.ok = true
            // console.log('ok')
        }
    }
}
</script>

<style lang="scss" scoped>
	.img-bbsb{
		position: relative;
		.img-item{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
