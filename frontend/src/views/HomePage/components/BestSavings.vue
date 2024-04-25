<template>
  <div>
    <div class="backgr4">
      <div class="row">
        <div class="col-lg-6 col-md-12">
          <div>
            <img :src="counterStore.children.image" class="picture-saving" />
          </div>
        </div>
        <div class="col-lg-6 col-md-12">
          <div>
            <div class="title-saving" v-html="counterStore.children.title"></div>
            <div class="para-saving">
              {{ counterStore.children.content }}
            </div>
            <button class="btn-saving-buy display-inline">Buy Now</button>
            <button class="btn-saving-see display-inline">See More</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from "@/stores/index";
import { onMounted } from "vue";
const counterStore = useCounterStore();
onMounted(() => {
  counterStore.fetchApi();
  console.log(counterStore.children);
});
</script>

<style lang="scss" scoped>
@import "@/style/styles.scss";
.backgr4 {
  background-color: $backgrSaving;
  margin: 0 45px;
  border-radius: 15px;
  padding: 20px 20px 0 20px;
  margin-top: 100px;
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.picture-saving {
  // object-fit: fill;
  // padding-bottom: 0;
  object-fit: contain;
  width: 100%;
  height: auto;
  padding: 60px 0 0px 25px;
  text-align: center;
  vertical-align: middle;
}
.btn-saving-buy {
  background-color: $button-color;
  border: 1px solid $button-color;
  padding: 10px 40px;
  font-size: 16px;
  color: white;
  margin-top: 30px;
  &:hover {
    background-color: $btn-hover-blue;
    border: 1px solid #007bff;
    color: #007bff;
  }
}
.btn-saving-see {
  background-color: $font-color;
  border: 1px solid $font-color;
  padding: 10px 40px;
  font-size: 16px;
  color: black;
  margin-top: 30px;
  margin-left: 10px;
  &:hover {
    background-color: $btn-hover-blue;
    border: 1px solid $font-color;
    color: $font-color;
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
@media screen and (max-width: 1023px) {
  .row {
    flex-direction: column-reverse;
  }
}
@media screen and (min-width: 375px) and (max-width: 811px) {
  .title-saving {
    font-size: 30px;
  }
  .para-saving {
    font-size: 16px;
  }
  .backgr4 {
    margin: 0;
    margin-top: 45px;
  }
}
@media screen and (max-width: 320px) {
  .backgr4 {
    margin: 0;
    margin-top: 45px;
  }
  .title-saving {
    font-size: 28px;
  }
  .btn-saving-buy {
    padding: 10px 30px;
    font-size: 15px;
  }
  .btn-saving-see {
    padding: 10px 30px;
    font-size: 15px;
  }
}
</style>
