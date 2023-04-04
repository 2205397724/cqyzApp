<template>
	<view>
		<view class='toolbar' @tap="format">
			<view
				style="position: relative;border: 1px solid #efefef;border-bottom: none; background: #f5f5f5;display: flex;justify-content: space-between;">
				<view>
					<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold">
					</view>
					<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic">
					</view>
					<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
						data-name="underline"></view>
					<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian"
						data-name="strike"></view>
					<view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''"
						class="iconfont icon-fontbgcolor"
						data-name="backgroundColor" data-value="#00ff00"></view>
					<view class="iconfont icon-charutupian" @tap="insertImage"></view>
				</view>
				<view
					style="margin-left: auto;border-left: 1px solid #efefef;display: flex;justify-content: center;align-items: center;">
					<uni-icons type="more-filled" size="20" :color="btn_status?'#06c':''"
						style="transform: rotate(90deg);" @click="btn_status=!btn_status"></uni-icons>
				</view>
			</view>
			<view :style="{'max-height':btn_status?'120px':'0'}"
				style="background: #fafafa;transition: all 0.3s;overflow: hidden;">
				<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi"
					data-name="align"
					data-value="left"></view>
				<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
					data-name="align"
					data-value="center"></view>
				<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi"
					data-name="align"
					data-value="right"></view>
				<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi"
					data-name="align"
					data-value="justify"></view>
				<!-- <view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height" data-name="lineHeight"
				 data-value="2"></view>
				<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing" data-name="letterSpacing"
				 data-value="2em"></view>
				<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju" data-name="marginTop"
				 data-value="20px"></view>
				<view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju" data-name="marginBottom"
				 data-value="20px"></view>
				<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily" data-value="Pacifico"></view>
				<view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize" data-name="fontSize"
				data-value="24px"></view>
				<view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color" data-name="color"
				data-value="#0000ff"></view> -->
				<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
				<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie"
					data-name="list"
					data-value="ordered"></view>
				<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
					data-name="list"
					data-value="bullet"></view>
				<!-- <view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
				<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view> -->
				<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1"
					data-name="header"
					:data-value="1"></view>
				<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao"
					data-name="script"
					data-value="sub"></view>
				<!-- <view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao" data-name="script"
				 data-value="super"></view>
				<view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl" data-name="direction"
				  data-value="rtl"></view>
				<view class="iconfont icon-clearedformat" @tap="removeFormat"></view> -->
				<view class="iconfont icon-date" @tap="insertDate"></view>
				<view class="iconfont icon-undo" @tap="undo"></view>
				<view class="iconfont icon-redo" @tap="redo"></view>
				<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
				<view class="iconfont icon-shanchu" @tap="clear"></view>
			</view>
		</view>
		<editor style="border: 1px solid #efefef;border-radius: 8rpx;padding: 10rpx;box-sizing: border-box;" :id="id"
			:placeholder="placeholder" @input="inputFn" @ready="onEditorReady" @statuschange="onStatusChange"
			showImgSize showImgToolbar showImgResize></editor>
	</view>
</template>

<script>
	import {
		VITE_APP_FOLDER_SRC
	} from '@/pages/framework/config/app.js'
	import GetFilesKey from '@/pages/framework/utils/file/file.js'
	import {
		ANNOUNCE
	} from '@/pages/framework/config/folder.js'
	export default {
		props: ['placeholder', 'id', 'val'],
		data() {
			return {
				formats: {},
				editorCtx: '',
				btn_status: false
			}
		},
		methods: {
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						GetFilesKey(ANNOUNCE, res.tempFilePaths).then(res2 => {
							this.editorCtx.insertImage({
								src: VITE_APP_FOLDER_SRC + res2[0],
								alt: '图像',
								success: function() {
									console.log('insert image success')
								}
							})
						})
					}
				})
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#' + this.id).context((res) => {
					this.editorCtx = res.context
					this.editorCtx.insertText({
						text: this.val
					})
				}).exec()
			},
			inputFn(val) {
				this.$emit('inputFn', val.detail.html)
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				this.editorCtx.format(name, value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./editor-icon.css";

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
	}

	.ql-active {
		color: #06c;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}
</style>
