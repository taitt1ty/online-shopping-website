<template>
  <div class="container">
    <h1 class="heading-testimonial">TESTIMONIAL</h1>
    <div class="row">
      <div class="col-md-1 example">
        <a class="before" style="text-decoration: none;" role="button" @click="beforePara">❮</a>
      </div>
      <div class="col-md-10 padding" >
        <h5 class="font-testimonial-name">
          {{ feedback.name }}<i class="fa fa-quote-left quote-right"></i>
        </h5>
        <h6 class="font-testimonial-note">{{ feedback.note }}</h6>
        <div class="font-testimonial-para">
          {{ feedback.content }}
        </div>
      </div>
      <div class="col-md-1 example" style="padding-left: 0;">
        <a class="next" style="text-decoration: none;" role="button" @click="afterPara">❯</a>
      </div>
    </div>
    <div class="d-flex justify-content-center superSmall" style="display: none;">
      <div class="example superSmall">
        <a class="before" style="text-decoration: none;" role="button" @click="beforePara">❮</a>
      </div>
      <div class="example superSmall" style="padding-left: 0;">
        <a class="next" style="text-decoration: none;" role="button" @click="afterPara">❯</a>
      </div>
    </div>
  </div>
</template>

<script>
// import * as request from "@/utils/request";
import { useCounterStore } from "@/stores/index";
export default {
  components: {

  },
  data(){
    const counterStore = useCounterStore();
    return {
      id: 1,
      feedback: [],
      counterStore
    }
  },
  mounted(){
    this.fetchFeedback(this.id);
  }
  ,
  methods: {
    async fetchFeedback(id) {
      this.feedback = await this.counterStore.fetchFeedback(id)
    },
    beforePara(){
      if(this.id > 1)
      {
        this.id = this.id - 1;
      }
      else
      {
        this.id = 3;
      }
    this.fetchFeedback(this.id);
    },
    afterPara() {
      if(this.id < 3)
      {
        this.id = this.id + 1;
      }
      else
      {
        this.id = 1;
      }
      this.fetchFeedback(this.id);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/styles.scss';
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.superSmall {
  display: none;
}
.heading-testimonial
{
	font-family: "poppins", sans-serif;
	font-weight: bold;
	font-size: 28px;
	text-align: center;
	margin-top: 80px;
	margin-bottom: 50px;
}
.example {
  position: relative;
}
.next {
  text-decoration: none;
  color: $colorIcon;
  background-color: $colorMain;
  padding: 30px 15px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.before {
  right: 0;
  @extend .next
}
.padding{
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  padding: 20px;
}
a:hover{
  color: $colorIcon;
}
.diplay-inline{
  display: inline;
}
.font-testimonial-name {
  color: $colorMain;
  text-align: left;
  font-weight: bold;
}
.font-testimonial-note {
  color: #bfc0c0;
  text-align: left;
}
.font-testimonial-para {
  color: $fontColor;
}
.quote-right {
  float: right;
  clear: right;
  color: $fontColor;
}
.backgr8 {
  margin: 15px 45px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  padding: 25px;
}
@media only screen and (max-width: 739px) {
  .superSmall{
    display: block;
    margin-top: 30px;
  }
  .col-md-1 {
    display: none;
  }
  .before {
    margin-right: 5px;
    padding: 13px 13px;
  }
  .next {
    padding: 13px 13px;
  }
}
@media  screen and (min-width: 375px) and (max-width: 811px) {
  
}
@media  screen and (max-width: 320px){
.font-testimonial-name {
font-size: 16px;
}
.font-testimonial-note {
  font-size: 16px
}
.font-testimonial-para {
  font-size: 13px;
}
}
</style>