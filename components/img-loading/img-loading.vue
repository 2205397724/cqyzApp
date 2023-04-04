<template>
    <view ref="bgbox" class="bg-box" :style="{backgroundColor:bg}">
        <view class="superman">
            <view class="base">
                <view class="shenti">
                    <view class="left">
                        <view class="h1" :style="{color:color}">
                            <view class="h1item">
                                loading
                            </view>
                        </view>
                        <text class="span span-box" :style="{backgroundColor:color}">
                            <text class="span" :style="{backgroundColor:color}" />
                            <text class="span" :style="{backgroundColor:color}" />
                            <text class="span" :style="{backgroundColor:color}" />
                            <text class="span" :style="{backgroundColor:color}" />
                        </text>
                        <view class="st1" :style="{backgroundColor:color}">
                            <view class="st1after" :style="{backgroundColor:bg}" />
                        </view>
                        <view class="st2" :style="{backgroundColor:color}">
                            <view class="st2after" :style="{backgroundColor:bg}" />
                        </view>
                    </view>
                    <view class="right" :style="{backgroundColor:color}" />
                    <view class="head">
                        <view class="fa1" :style="{backgroundColor:color}" />
                        <!-- <view class="fa2" /> -->
                    </view>
                </view>
            </view>
        </view>
        <view class="longfazers">
            <text class="span" :style="{backgroundColor:color}" />
            <text class="span" :style="{backgroundColor:color}" />
            <text class="span" :style="{backgroundColor:color}" />
            <text class="span" :style="{backgroundColor:color}" />
        </view>
    </view>
</template>

<script>
// <img-loading class="img-item" :bg="loadBg" :color="loadColor" />
export default {
    name: 'ImgLoading',
    props: {
        bg: {
            type: String,
            default: '#000'
        },
        color: {
            type: String,
            default: '#eeeeee'
        }
    },
    data() {
        return {
				
        }
    }
}
</script>

<style lang="scss" scoped>

	  $color: #000;
	  $bg: #f1c40f;

	.bg-box{
		background-color: $bg;
		overflow: hidden;
		position: relative;
		height: 100%;
		width: 100%;
	}
	.bg-box .h1 {
		position: absolute;
		font-weight: 600;
		font-size: 10px;
		text-transform: uppercase;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		z-index: 9;
		display: flex;
		justify-content: center;
		color: $color;
	}
	.bg-box .h1 .h1item{
		padding-top: 26%;
		margin-left: 60%;
	}
	
	.bg-box .superman {
		position: absolute;
		top: 45%;
		left: 0;
		width: 100%;
		animation: speeder 0.4s linear infinite;
	}
	
	.bg-box .superman .span-box {
		padding-top: 5%;
		max-width: 35px;
		width: 35%;
		background: $color;
		position: absolute;
		top: 0;
		right: -6%;
		border-radius: 2px 10px 1px 0;
		margin-top: -8%;
	}

	.bg-box .base {
		width: 100%;
		position: relative;
}
	.bg-box .base .shenti{
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.bg-box .base .shenti .left{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		max-width: 100px;
		width: 30%;
		position: relative;
	}
	.bg-box .base .shenti .left .st1{
		max-width: 55%;
		padding-bottom: 18%;
		width: 100%;
		background-color: $color;
		position: relative;
		z-index: 1;
	}
	.bg-box .base .shenti .left .st1 .st1after{
		content: "";
		display: block;
		position: absolute;
		left: -120%;
		top: 0;
		height: 100%;
		width: 240%;
		background-color: $bg;
		transform: rotate(17deg);
	}
	.bg-box .base .shenti .left .st2{
		padding-bottom: 12%;
		width: 100%;
		background-color: $color;
		position: relative;
		z-index: 3;
		margin-top: -6%;
	}
	.bg-box .base .shenti .left .st2 .st2after{
		content: "";
		display: block;
		position: absolute;
		left: -120%;
		top: 0;
		height: 110%;
		width: 240%;
		background-color: $bg;
		transform: rotate(7deg);
	}
	.bg-box .base .shenti .right{
		// padding-bottom: 24%;
		max-width: 22px;
		width: 7%;
		// border-radius: 50%;
		background: $color;
		// margin-left: -11px;
		position: relative;
		z-index: 5;
		border-radius: 0 50% 50% 0;
	}
	.bg-box .base .shenti .head {
		max-width: 16px;
		width: 6%;
	}
	
	.bg-box .base .shenti .head .fa1{
		padding-bottom: 100%;
		max-width: 20px;
		background: $color;
		border-radius: 20px 20px 0 0;
		// transform: rotate(-44deg);
		// margin-left: -5px;
		// margin-top: -4px;
	}
	// .bg-box .base .shenti .head .fa2{
	// 	max-width: 13px;
	// 	padding-bottom:78% ;
	// 	background: #000;
	// 	transform-origin: 50% 50%;
	// 	border-radius: 0 0 0 2px;
	// 	margin-top: -8px;
	// 	margin-left: 3px;
	// }

	.bg-box .superman .span-box .span:nth-child(1),
	.bg-box .superman .span-box .span:nth-child(2),
	.bg-box .superman .span-box .span:nth-child(3),
	.bg-box .superman .span-box .span:nth-child(4) {
		max-width: 30px;
		width: 100%;
		padding-top: 2%;
		background: $color;
		position: absolute;
		animation: fazer1 0.2s linear infinite;
	}
	
	.bg-box .superman .span-box .span:nth-child(2) {
		top: 3px;
		animation: fazer2 0.4s linear infinite;
	}
	
	.bg-box .superman .span-box .span:nth-child(3) {
		top: 1px;
		animation: fazer3 0.4s linear infinite;
		animation-delay: -1s;
	}
	
	.bg-box .superman .span-box .span:nth-child(4) {
		top: 4px;
		animation: fazer4 1s linear infinite;
		animation-delay: -1s;
	}
	
	@keyframes fazer1 {
		0% {
			left: 0;
		}
	
		100% {
			left: -80px;
			opacity: 0;
		}
	}
	
	@keyframes fazer2 {
		0% {
			left: 0;
		}
	
		100% {
			left: -100px;
			opacity: 0;
		}
	}
	
	@keyframes fazer3 {
		0% {
			left: 0;
		}
	
		100% {
			left: -50px;
			opacity: 0;
		}
	}
	
	@keyframes fazer4 {
		0% {
			left: 0;
		}
	
		100% {
			left: -150px;
			opacity: 0;
		}
	}
	
	@keyframes speeder {
		0% {
			transform: translate(2px, 1px) rotate(0deg);
		}
	
		10% {
			transform: translate(-1px, -3px) rotate(-1deg);
		}
	
		20% {
			transform: translate(-2px, 0px) rotate(1deg);
		}
	
		30% {
			transform: translate(1px, 2px) rotate(0deg);
		}
	
		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}
	
		50% {
			transform: translate(-1px, 3px) rotate(-1deg);
		}
	
		60% {
			transform: translate(-1px, 1px) rotate(0deg);
		}
	
		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}
	
		80% {
			transform: translate(-2px, -1px) rotate(1deg);
		}
	
		90% {
			transform: translate(2px, 1px) rotate(0deg);
		}
	
		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}
	
	.bg-box .longfazers {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	.bg-box .longfazers .span {
		position: absolute;
		height: 2px;
		width: 20%;
		background: $color;
	}
	
	.bg-box .longfazers .span:nth-child(1) {
		top: 20%;
		animation: lf 0.6s linear infinite;
		animation-delay: -5s;
	}
	
	.bg-box .longfazers .span:nth-child(2) {
		top: 40%;
		animation: lf2 0.8s linear infinite;
		animation-delay: -1s;
	}
	
	.bg-box .longfazers .span:nth-child(3) {
		top: 60%;
		animation: lf3 0.6s linear infinite;
	}
	
	.bg-box .longfazers .span:nth-child(4) {
		top: 80%;
		animation: lf4 0.5s linear infinite;
		animation-delay: -3s;
	}
	
	@keyframes lf {
		0% {
			left: 200%;
		}
	
		100% {
			left: -200%;
			opacity: 0;
		}
	}
	
	@keyframes lf2 {
		0% {
			left: 200%;
		}
	
		100% {
			left: -200%;
			opacity: 0;
		}
	}
	
	@keyframes lf3 {
		0% {
			left: 200%;
		}
	
		100% {
			left: -100%;
			opacity: 0;
		}
	}
	
	@keyframes lf4 {
		0% {
			left: 200%;
		}
	
		100% {
			left: -100%;
			opacity: 0;
		}
	}
</style>
