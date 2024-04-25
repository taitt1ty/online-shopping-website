<template>
  <div>
    <div class="backgr6">
        <div class="row">
            <div class="col-md-5">
                <img :src="counterStore.gift.image" class="picture-gift">
            </div>
            <div class="col-md-7">
                <div class="title-saving" v-html="counterStore.gift.title"></div>
                <div class="para-saving">{{ counterStore.gift.content }}</div>
				<div class="small">
					<button class="btn-gift-buy display-inline">Buy Now</button>
                <button class="btn-gift-see display-inline">See More</button>
				</div>
                
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/index';
import { onMounted } from 'vue';
const counterStore = useCounterStore();
onMounted(() => {
	counterStore.fetchApiGift();
});
</script>

<style lang="scss" scoped>
@import "@/style/styles.scss";
.backgr6
{
	background-color: #6929a5;
	margin: 0 45px;
	border-radius: 15px;
	margin-top: 80px;
	.row
	{
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.picture-gift
{
	object-fit: contain;
	width: 100%;
	height: auto;
	padding: 60px 0 60px 25px;
	text-align: center;
	vertical-align: middle;
}
.btn-gift-buy
{
	background-color: white;
	border: 1px solid white;
	padding: 10px 40px;
	font-size: 16px;
	color: black;
	margin-top: 30px;
	&:hover {
		background-color: #6929a5;
		border: 1px solid white;
		color: white;
	}
}
.btn-gift-see
{
	background-color: #9242dd;
	border: 1px solid #9242dd;
	padding: 10px 40px;
	font-size: 16px;
	color: white;
	margin-top: 30px;
	margin-left: 10px;
	&:hover
	{
		background-color: #6929a5;
		border: 1px solid #6f42c1;
		color: #6f42c1;
	}
}
.title-saving {
  font-size: 32px;
  font-weight: bold;
  text-align: left;
  color: $font-color;
}
.para-saving {
  font-size: 16px;
  text-align: left;
  color: $font-color;
}
.display-inline {
  display: inline-block;
}
@media only screen and (max-width: 739px) {
	.picture-gift {
		width: 80%;
		padding: 60px 0 60px 90px;
	}
	.title-saving{
		font-size: 28px;
		padding-left: 30px;
	}
	.para-saving {
	padding-left: 30px;
	padding-right: 20px;
	}
	.btn-gift-buy{
		margin-top: 20px;
		margin-bottom: 30px;
	}
	.btn-gift-see {
		margin-top: 20px;
		margin-bottom: 30px;
	}
	.small {
		text-align: left;
		padding-left: 30px;
	}
}
@media  screen and (min-width: 375px) and (max-width: 811px) {
  .title-saving{
    font-size: 30px;
  }
  .para-saving {
    font-size: 16px;
  }
  .backgr6 {
    margin: 0;
    margin-top: 45px;
  }
}
@media  screen and (max-width: 320px){
	.backgr6 {
    margin: 0;
    margin-top: 45px;
  }
  .btn-gift-buy
{
	padding: 10px 20px;
	font-size: 15px;
	margin-left: 15px;
}
.btn-gift-see
{
	padding: 10px 20px;
	font-size: 15px;
	margin-left: 10px;
}
}
</style>