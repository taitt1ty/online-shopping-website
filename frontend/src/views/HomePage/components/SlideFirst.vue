<template>
  <div class="backgr1">
    <a-carousel autoplay>
      <a-carousel-slide v-for="section in counterStore.sections" :key="section.id">
        <div class="row">
          <div class="col-md-8 col-sm-12">
              <div class="position-welcome">
                <h1 class="title-welcome" v-html="section.title"></h1>
                <p class="para-welcome">{{ section.content }}</p>
                <button type="button" class="btn-welcome">CONTACT US</button>
              </div>
          </div>
          <div class="col-md-4 col-sm-12">
            <img :src="section.image" class="picture">
          </div>
        </div>
      </a-carousel-slide>
    </a-carousel>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { onMounted } from 'vue';
import { Carousel, CarouselSlide } from 'ant-design-vue';
import { useCounterStore } from "@/stores/index";

export default defineComponent({
  props:{imageURL: String, },
  components: {
    'a-carousel': Carousel,
    'a-carousel-slide': CarouselSlide,
  },
  setup(){
    const counterStore = useCounterStore();
    onMounted(() => {
    counterStore.fetchApiSlide();
    });
    return {
      counterStore,
    }
  }
});
</script>


<style lang="scss" scoped>
@import '@/style/styles.scss';
.row .col-sm-12 .img{
  vertical-align: middle;
}
.backgr1
{
  background-color: $backgr1;
	margin: 0 45px;
	border-radius: 0 0 15px 15px;
	padding:20px;
  .row
  {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
}
.title-welcome
{
	font-size: 56px;
	font-weight: bold;
	text-align: left;
	color: $font-color;
}
.para-welcome
{
	font-size: 18px;
	text-align: left;
	color: $font-color;
}
.position-welcome
{
	padding-left: 40px;
}
.btn-welcome
{
	background-color: $button;
	border: 1px solid $button;
	padding: 10px 40px;
	font-size: 16px;
	color: $font-color;
	border-radius: 5px;
	margin-top: 20px;
  &:hover
  {
    background-color: #f89cab;
    color: $button;
    border: 1px solid $button;
  }
}
.picture {
  object-fit: contain;
	text-align: center;
	vertical-align: middle;
  width: 100%;
  height: auto;
}
@media screen and (min-width: 740px) and (max-width: 1023px) {
  .title-welcome
{
	font-size: 40px;
}
.para-welcome
{
	font-size: 14px;
}
.btn-welcome
{
  margin-top: 10px;
  font-size: 12px;
}
.picture {
  width: 100%;
  height: 500px;
}
}
@media only screen and (max-width: 739px) {
  .title-welcome
{
	font-size: 40px;
}
  .picture {
  vertical-align: middle;
  width: 100%;
  height: 500px;
  padding-top: 20px;
}
}
@media  screen and (min-width: 375px) and (max-width: 811px) {
  .backgr1
{
	margin: 0;
  padding: 0;
}
.picture {
  width: 100%;
  height: 300px;
}
.title-welcome
{
	font-size: 30px;
}
.para-welcome {
  font-size: 16px;
}
.btn-welcome {
  font-size: 12px;
}
.position-welcome{
  padding-left: 0;
}
}

@media  screen and (max-width: 320px){
  .backgr1{
    margin: 0;
    .row {
      padding: 0;
    }
  }
  .col-md-8 {
    padding-left: 0;
  }
  .title-welcome {
    font-size: 27px;
  }
  .para-welcome {
     font-size: 15px;
  }
  .picture {
    height: 300px;
  }
  .btn-welcome{
    font-size: 15px;
    padding: 10px 20px;
    margin-left: 30px;
  }
  .position-welcome {
    padding-left: 0;
  }
}
// @media screen and (max-width: 250px) {
//   .position-welcome{
//     padding-left: 0;
//   }
// }
</style>
